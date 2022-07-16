import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

import router from './routes'

const app = new Hono()

app.use('*', logger(), prettyJSON())

app.route('/api', router)

// Custom Not Found Message
app.notFound((c) => {
  return c.json(
    {
      message: 'Not Found',
      status: 404
    },
    404
  )
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json(
    {
      message: `${err}`,
      status: 500
    },
    500
  )
})

app.get('/', (c) => c.json({ message: 'Hello World!' }))

export default {
  port: parseInt(process.env.PORT || '3000', 10),
  fetch: app.fetch
}
