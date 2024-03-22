import { Elysia } from 'elysia'
import { eq } from 'drizzle-orm'

import { auth } from '../auth'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { UnauthorizedError } from '../errors/unauthorized-error'

const routeSchema = {
  detail: {
    summary: 'Update order status from delivering to delivered',
    tags: ['orders'],
  },
}

export const deliverOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/deliver',
  async ({ getCurrentUser, set, params }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found.' }
    }

    if (order.status !== 'delivering') {
      set.status = 400
      return { message: 'Order is not in delivering.' }
    }

    await db
      .update(orders)
      .set({ status: 'delivered' })
      .where(eq(orders.id, orderId))
  },
  routeSchema,
)
