const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest({ request, env }) {
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (method === 'GET') {
    const saved = await env.COMBAT_STATE.get('roster');
    return new Response(saved || '{"characters":{}}', { headers: CORS });
  }

  if (method === 'POST') {
    let body;
    try {
      body = await request.text();
      JSON.parse(body);
    } catch {
      return new Response('{"error":"invalid body"}', { status: 400, headers: CORS });
    }
    await env.COMBAT_STATE.put('roster', body);
    return new Response('{"ok":true}', { headers: CORS });
  }

  return new Response('{"error":"method not allowed"}', { status: 405, headers: CORS });
}
