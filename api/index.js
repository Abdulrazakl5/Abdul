export const config = {
  runtime: 'edge',
};

export default async (request) => {
  const { pathname } = new URL(request.url);

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(JSON.stringify({ code: 200 }), {
      status: 200,
      headers,
    });
  }

  // Health check
  if (pathname === '/health') {
    return new Response(
      JSON.stringify({
        status: 'healthy',
        code: 200,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers }
    );
  }

  // Status
  if (pathname === '/status') {
    return new Response(
      JSON.stringify({
        status: 'operational',
        code: 200,
        service: 'Abdul Cybersecurity Plan',
      }),
      { status: 200, headers }
    );
  }

  // API test
  if (pathname === '/api/test') {
    return new Response(
      JSON.stringify({
        success: true,
        code: 200,
        project: 'VeloPay Cybersecurity Plan',
        version: '1.0.0',
      }),
      { status: 200, headers }
    );
  }

  // Default - return 200 for everything
  return new Response(
    JSON.stringify({
      code: 200,
      message: 'Request processed successfully',
      path: pathname,
      method: request.method,
    }),
    { status: 200, headers }
  );
};
