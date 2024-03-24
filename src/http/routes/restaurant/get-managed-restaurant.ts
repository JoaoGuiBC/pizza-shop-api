import { Elysia } from 'elysia'

import { auth } from '../../auth'
import { db } from '@/db/connection'

const routeSchema = {
  detail: {
    summary: 'Get current user restaurant data',
    tags: ['restaurants'],
  },
}

export const getManagedRestaurant = new Elysia().use(auth).get(
  '/managed-restaurant',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return managedRestaurant
  },
  routeSchema,
)
