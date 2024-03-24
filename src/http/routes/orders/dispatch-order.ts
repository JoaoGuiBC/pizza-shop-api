import { Elysia } from 'elysia'
import { eq } from 'drizzle-orm'

import { auth } from '../../auth'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { UnauthorizedError } from '../../errors/unauthorized-error'

const routeSchema = {
  detail: {
    summary: 'Update order status from processing to delivering',
    tags: ['orders'],
  },
}

export const dispatchOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/dispatch',
  async ({ getCurrentUser, set, params }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found.' }
    }

    if (order.status !== 'processing') {
      set.status = 400
      return { message: 'Order is not processing.' }
    }

    await db
      .update(orders)
      .set({ status: 'delivering' })
      .where(eq(orders.id, orderId))
  },
  routeSchema,
)
