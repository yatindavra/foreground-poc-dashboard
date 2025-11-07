let current = { lat: 0, lng: 0 }

export async function POST(req) {
  current = await req.json()
  return new Response(JSON.stringify({ ok: true }))
}

export function GET() {
  return new Response(JSON.stringify(current))
}

export { current }
