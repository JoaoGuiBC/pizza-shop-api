import dayjs from 'dayjs'
import { Elysia } from 'elysia'
import { and, eq, gte, sql, count } from 'drizzle-orm'

import { auth } from '../../auth'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { UnauthorizedError } from '../../errors/unauthorized-error'

const routeSchema = {
  detail: {
    summary: 'Get current month canceled orders amount',
    tags: ['metrics'],
  },
}

export const getMonthCanceledOrdersAmount = new Elysia().use(auth).get(
  '/metrics/month-canceled-orders-amount',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const currentMonthWithYear = today.format('YYYY-MM')
    const lastMonthWithYear = lastMonth.format('YYYY-MM')

    const ordersPerMonth = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          eq(orders.status, 'canceled'),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === currentMonthWithYear
    })

    const lastMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null

    return {
      amount: currentMonthOrdersAmount?.amount ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  },
  routeSchema,
)
