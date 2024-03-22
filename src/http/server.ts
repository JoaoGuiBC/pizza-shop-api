import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { approveOrder } from './routes/approve-order'
import { sendAuthLink } from './routes/send-auth-link'
import { getOrderDetails } from './routes/get-order-details'
import { registerRestaurant } from './routes/register-restaurants'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { authenticateFromLink } from './routes/authenticate-from-link'

const app = new Elysia()

app.use(swagger()).onError(({ code, error, set }) => {
  switch (code) {
    case 'VALIDATION': {
      set.status = error.status
      return { code, message: 'validation failed.', error: error.message }
    }
    default: {
      console.error(error)

      return new Response(null, { status: 500 })
    }
  }
})

app
  .use(signOut)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)

app.listen(3333, () => {
  console.log('HTTP server running')
})
