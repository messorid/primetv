import crypto from 'crypto'

export async function POST(request) {
  const body = await request.json()
  const { email, phone, eventName, value = 0, currency = 'USD' } = body

  const pixelId     = process.env.FB_PIXEL_ID
  const accessToken = process.env.FB_ACCESS_TOKEN
  const apiVersion  = process.env.FB_API_VERSION || 'v17.0'
  const endpoint    = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`

  // 1) Crea timestamp en segundos
  const eventTime = Math.floor(Date.now() / 1000)

  // 2) Hashea email y teléfono según guía (SHA256 en minúscula)
  const hash = (str) =>
    crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex')

  const user_data = {
    em:  email ? [hash(email)]  : [],
    ph:  phone ? [hash(phone)]  : [],
    client_user_agent: request.headers.get('user-agent') || ''
  }

  // 3) Construye el payload de un solo evento
  const payload = {
    data: [
      {
        event_name:    eventName,            // p.e. "Lead" o "Contact"
        event_time:    eventTime,
        action_source: 'website',
        event_source_url: request.headers.get('referer') || '',
        user_data,
        custom_data: {
          currency,
          value
        },
        // Para deduplicar con el píxel de navegador:
        // event_id: `${eventName}_${eventTime}_${hash(email||phone)}`
      }
    ]
    // , test_event_code: 'TEST12345'        // opcional para entorno de pruebas
  }

  // 4) Envía la petición POST a Facebook
  const res = await fetch(`${endpoint}?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const json = await res.json()

  return new Response(JSON.stringify({ success: res.ok, result: json }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
