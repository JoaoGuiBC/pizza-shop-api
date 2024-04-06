import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { routes } from './routes'

const app = new Elysia()

app.use(
  cors({
    credentials: true,
    allowedHeaders: ['content-type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    origin: (request): boolean => {
      const origin = request.headers.get('origin')

      if (!origin) {
        return false
      }

      return true
    },
  }),
)

app.use(swagger()).onError(({ code, error, set }) => {
  switch (code) {
    case 'VALIDATION': {
      set.status = error.status
      return { code, message: 'validation failed.', error: error.message }
    }
    case 'NOT_FOUND': {
      return new Response(null, { status: 404 })
    }
    default: {
      console.error(error)
      return new Response(null, { status: 500 })
    }
  }
})

app.use(routes)

app.listen(3333, () => {
  console.log('HTTP server running')
})
