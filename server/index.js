// server/index.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const pool = require('./config/db');

// Export pool so other files/routes can use it
module.exports = { pool };

// 2. Import Enterprise Route Modules
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const stockRoutes = require('./routes/stockRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const companyRoutes = require('./routes/companyRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const appAuthRoutes = require('./routes/appAuthRoutes');
const appPublicRoutes = require('./routes/appPublicRoutes');
const appOrderRoutes = require('./routes/appOrderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import utilities
const { syncAccessControlDefaults } = require('./utils/accessBootstrap');
const { syncCustomerAppSchema } = require('./utils/customerAppBootstrap');
const { syncCustomerCoreSchema } = require('./utils/customerCoreBootstrap');

const app = express();

// 3. Optimized CORS & Security Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5172',
    'https://moto-leasing-app.vercel.app',
    'https://moto-leasing-app-git-main-mibrar522s-projects.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app') || 
                         origin.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.error(`[CORS Blocked]: Unauthorized origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

app.use(compression({ threshold: 1024 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Global Request Logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// 5. Primary Routing Table
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/leases', leaseRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/stock', stockRoutes);
app.use('/api/v1/dealers', dealerRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/workflow', workflowRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/app/auth', appAuthRoutes);
app.use('/api/v1/app', appPublicRoutes);
app.use('/api/v1/app/orders', appOrderRoutes);

// Compatibility aliases for older deployed/cached clients that call paths
// without the /api/v1 prefix, for example /admin/dashboard.
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/leases', leaseRoutes);
app.use('/customers', customerRoutes);
app.use('/employees', employeeRoutes);
app.use('/products', productRoutes);
app.use('/sales', salesRoutes);
app.use('/stock', stockRoutes);
app.use('/dealers', dealerRoutes);
app.use('/companies', companyRoutes);
app.use('/workflow', workflowRoutes);
app.use('/uploads/db', uploadRoutes);
app.use('/app/auth', appAuthRoutes);
app.use('/app/orders', appOrderRoutes);
app.use('/app', appPublicRoutes);

// 6. Global Error Handler
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS Error', message: err.message });
    }
    console.error(`[Error]: ${err.stack}`);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    });
});

// 7. Server Initialization
const PORT = process.env.PORT || 10000;
const SERVER_HOST = '0.0.0.0';

const startServer = async () => {
    try {
        console.log('Initializing Enterprise Server...');
        
        // Verify database connection
        await pool.query('SELECT NOW()');
        console.log('✓ Database connection successful.');

        // Keep access roles/features present in hosted PostgreSQL.
        try {
            await syncAccessControlDefaults();
            console.log('Access-control defaults verified.');
        } catch (bootstrapError) {
            console.warn('Access-control bootstrap skipped:', bootstrapError.message);
        }
        // await syncCustomerAppSchema();
        // await syncCustomerCoreSchema();
        // console.log('✓ Database schemas verified.');

        app.listen(PORT, SERVER_HOST, () => {
            console.log(`🚀 Server fully operational at http://${SERVER_HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('CRITICAL: Server initialization failed!');
        console.error('Error Details:', error);
        // Important: If this fails in the future, check your Render Env Variables
        process.exit(1);
    }
};

startServer();
