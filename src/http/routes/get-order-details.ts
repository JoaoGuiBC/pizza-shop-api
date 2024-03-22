import { Elysia, t } from 'elysia'

import { auth } from '../auth'
import { db } from '@/db/connection'
import { UnauthorizedError } from '../errors/unauthorized-error'

const routeSchema = {
  detail: {
    summary: 'Restaurant manager get the details of an order',
    tags: ['orders'],
  },
  response: {
    401: t.String({ default: 'Unauthorized' }),
    400: t.String({ default: 'Order not found' }),
  },
}

export const getOrderDetails = new Elysia().use(auth).get(
  '/orders/:orderId',
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: { name: true },
            },
          },
        },
      },
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found' }
    }

    return order
  },
  routeSchema,
)
