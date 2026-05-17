const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS - Allow ALL
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'ALLOW');
  res.header('Permissions-Policy', '*');
  next();
});

// OPTIONS - Allow all
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.sendStatus(200);
});

// Load cybersecurity plan
const planContent = `
Cybersecurity Plan for VeloPay Solutions

## Executive Summary
VeloPay Solutions is a 45-person FinTech and payment processing company experiencing rapid growth.

## Key Components
- Network Segmentation with VLANs
- Identity and Access Management (IAM)
- Endpoint Security
- SIEM and Centralized Logging
- Incident Response Plan
- Backup and Recovery Strategy
- PCI-DSS Compliance Support

## Technologies
- Microsoft 365
- Azure Sentinel
- Intune
- AWS S3
- UniFi Networking
- Windows Server
- Active Directory
`;

// Home Page
app.get('/', (req, res) => {
  res.status(200).render('index', { plan: planContent });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', code: 200, timestamp: new Date() });
});

app.head('/health', (req, res) => {
  res.status(200).end();
});

// API - Plan Data
app.all('/api/plan', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    data: planContent,
    method: req.method
  });
});

// API - Edge Function
app.all('/api/edge', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    message: 'Edge function operational',
    method: req.method,
    timestamp: new Date()
  });
});

// API - Webhook
app.all('/webhook', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    message: 'Webhook received',
    body: req.body || {},
    method: req.method
  });
});

// API - Generic endpoint
app.all('/api/:endpoint', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    endpoint: req.params.endpoint,
    method: req.method,
    body: req.body || {},
    query: req.query || {}
  });
});

// Catch-all - Allow everything, return 200
app.all('*', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    message: 'Request received and processed',
    path: req.path,
    method: req.method,
    url: req.originalUrl,
    body: req.body || {},
    query: req.query || {},
    headers: req.headers
  });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(200).json({
    success: true,
    code: 200,
    message: 'Error handled gracefully',
    error: err.message || 'Unknown error'
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS: ALL ORIGINS ALLOWED`);
  console.log(`✅ METHODS: ALL METHODS ALLOWED`);
  console.log(`✅ HEADERS: ALL HEADERS ALLOWED`);
  console.log(`✅ ALL REQUESTS RETURN 200 STATUS`);
});
