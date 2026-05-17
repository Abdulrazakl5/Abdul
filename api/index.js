export default async (req, res) => {
  // Set CORS headers - Allow ALL
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'ALLOW');
  res.setHeader('Permissions-Policy', '*');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, code: 200 });
  }

  // All requests return 200
  return res.status(200).json({
    success: true,
    code: 200,
    status: 'operational',
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString(),
    message: 'Edge function working perfectly',
    body: req.body || {},
    query: req.query || {},
    headers: req.headers
  });
};
