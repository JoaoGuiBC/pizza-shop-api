import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { routes } from './routes'

const app = new Elysia()

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
