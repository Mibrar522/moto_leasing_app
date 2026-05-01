// server/middleware/roleCheck.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';
const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';

exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = {
            ...decoded,
            role_id: decoded?.role_id != null ? Number(decoded.role_id) : decoded?.role_id,
            real_role_id: decoded?.real_role_id != null ? Number(decoded.real_role_id) : decoded?.real_role_id,
        };

        if (!isSuperAdminSession(req.user)) {
            // Refresh scope + features from DB so permission flips are immediate (JWT can be stale for up to 1h).
            const access = await pool.query(
                `
                WITH ctx AS (
                    SELECT
                        u.id,
                        u.role_id,
                        r.role_name,
                        COALESCE(u.dealer_id, e.dealer_id) AS dealer_id,
                        e.id AS employee_id
                    FROM users u
                    LEFT JOIN roles r ON r.id = u.role_id
                    LEFT JOIN employees e ON e.user_id = u.id
                    WHERE u.id = $1
                    LIMIT 1
                ),
                allowed AS (
                    SELECT f.feature_key
                    FROM ctx
                    JOIN role_permissions rp ON rp.role_id = ctx.role_id
                    JOIN features f ON f.id = rp.feature_id
                    UNION
                    SELECT f.feature_key
                    FROM ctx
                    JOIN employee_features efm ON efm.employee_id = ctx.employee_id
                    JOIN features f ON f.id = efm.feature_id
                ),
                denied AS (
                    SELECT f.feature_key
                    FROM ctx
                    JOIN employee_feature_overrides efo ON efo.employee_id = ctx.employee_id AND efo.access_mode = 'DENY'
                    JOIN features f ON f.id = efo.feature_id
                )
                SELECT
                    ctx.role_id,
                    ctx.role_name,
                    ctx.dealer_id,
                    COALESCE(
                        ARRAY_AGG(DISTINCT allowed.feature_key) FILTER (
                            WHERE allowed.feature_key IS NOT NULL
                              AND allowed.feature_key NOT IN (SELECT feature_key FROM denied)
                        ),
                        '{}'::text[]
                    ) AS feature_keys
                FROM ctx
                LEFT JOIN allowed ON true
                GROUP BY ctx.role_id, ctx.role_name, ctx.dealer_id
                `,
                [req.user.id]
            );

            const row = access.rows[0] || {};
            // Backfill dealer scope if the JWT is missing it.
            if (!req.user.dealer_id && !req.user.effective_dealer_id) {
                req.user.dealer_id = row.dealer_id || null;
                req.user.effective_dealer_id = row.dealer_id || null;
            }
            // Refresh role/feature gates for this request.
            req.user.role_id = row.role_id != null ? Number(row.role_id) : req.user.role_id;
            req.user.role_name = row.role_name || req.user.role_name;
            req.user.feature_keys = Array.isArray(row.feature_keys) ? row.feature_keys : (req.user.feature_keys || []);
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Token expired or invalid" });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        const effectiveRoleId = req.user?.role_id;
        const realRoleId = req.user?.real_role_id;

        if (!roles.includes(effectiveRoleId) && !roles.includes(realRoleId)) {
            return res.status(403).json({ message: "Insufficient permissions for this action" });
        }
        next();
    };
};

exports.restrictToRoleNames = (...roleNames) => {
    return (req, res, next) => {
        const effectiveRoleName = req.user?.role_name;
        const realRoleName = req.user?.real_role_name;

        if (!roleNames.includes(effectiveRoleName) && !roleNames.includes(realRoleName)) {
            return res.status(403).json({ message: "Insufficient permissions for this action" });
        }
        next();
    };
};

exports.restrictToFeature = (...featureKeys) => {
    return (req, res, next) => {
        if (isSuperAdminSession(req.user)) {
            return next();
        }

        const userFeatures = req.user.feature_keys || [];
        const hasFeature = featureKeys.some((featureKey) => userFeatures.includes(featureKey));

        if (!hasFeature) {
            return res.status(403).json({ message: "Feature access denied" });
        }

        next();
    };
};

// Prevent cross-dealer data leakage: non-super-admin sessions must be bound to a dealer,
// except employee/agent logins that are already scoped to their own user id.
exports.requireDealerScope = (req, res, next) => {
    if (isSuperAdminSession(req.user)) {
        return next();
    }

    const roleName = String(req.user?.role_name || req.user?.real_role_name || '').toUpperCase();
    const isEmployeeLogin = Number(req.user?.role_id) === 3;
    const isAgentLogin = roleName === 'AGENT';

    // Employees/agents are scoped to their own user id in controllers.
    if (isEmployeeLogin || isAgentLogin) {
        return next();
    }

    const effectiveDealerId = req.user?.effective_dealer_id || req.user?.dealer_id || null;
    if (!effectiveDealerId) {
        return res.status(403).json({
            message: 'Dealer scope is missing for this account. Assign a dealer to this user (or switch into a dealer profile) before accessing dealer data.',
        });
    }

    next();
};
