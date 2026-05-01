// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import Enterprise Route Modules
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
const path = require('path');
const { syncAccessControlDefaults } = require('./utils/accessBootstrap');
const { syncCustomerAppSchema } = require('./utils/customerAppBootstrap');
const { syncCustomerCoreSchema } = require('./utils/customerCoreBootstrap');

const app = express();
const SERVER_HOST = process.env.HOST || '0.0.0.0';
const CORS_ORIGIN = String(process.env.CORS_ORIGIN || '*').trim();

// 2. Standard Enterprise Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5172',
        'https://moto-leasing-app.vercel.app',
        'https://moto-leasing-app-git-main-mibrar522s-projects.vercel.app',
        /\.vercel\.app$/
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Global Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// 4. Primary Routing Table (API v1)
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
app.use('/api/v1/app/auth', appAuthRoutes);
app.use('/api/v1/app', appPublicRoutes);
app.use('/api/v1/app/orders', appOrderRoutes);

// 5. Global Enterprise Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'Internal Server Error',
        message: err.message,
    });
});

// 6. Server Initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const syncResult = await syncAccessControlDefaults();
        console.log(
            `Access control defaults synced (${syncResult.rolesEnsured} roles, ${syncResult.featuresEnsured} features).`
        );

        await syncCustomerAppSchema();
        console.log('Customer app schema synced.');

        await syncCustomerCoreSchema();
        console.log('Customer core schema synced.');

        app.listen(PORT, SERVER_HOST, () => {
            console.log(`Enterprise Server running on ${SERVER_HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to sync access control defaults:', error.message);
        process.exit(1);
    }
};

startServer();
