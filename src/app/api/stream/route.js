import { current } from '../location/route'

export function GET() {
  let send
  const stream = new ReadableStream({
    start(controller) {
      send = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify(current)}\n\n`)
      }, 2000)
    },
    cancel() {
      clearInterval(send)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}
