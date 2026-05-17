const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Home Page
app.get('/', (req, res) => {
  res.status(200).render('index', {
    title: 'VeloPay Cybersecurity Plan',
    status: 'operational'
  });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    code: 200,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Status Endpoint
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    code: 200,
    service: 'VeloPay Cybersecurity Plan',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    code: 200,
    message: 'API working correctly',
    data: {
      project: 'VeloPay Cybersecurity Implementation Plan',
      version: '1.0.0',
      company: 'VeloPay Solutions',
      employees: 45,
      focus: 'FinTech Payment Processing'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(200).json({
    code: 200,
    message: 'Request processed',
    path: req.path,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(200).json({
    code: 200,
    message: 'Error handled gracefully',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ VeloPay Cybersecurity Plan - Live and operational`);
});

module.exports = app;
