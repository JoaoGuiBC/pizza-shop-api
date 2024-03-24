import { Elysia } from 'elysia'

import { listOrders } from './orders/list-orders'
import { cancelOrder } from './orders/cancel-order'
import { signOut } from './authentication/sign-out'
import { deliverOrder } from './orders/deliver-order'
import { approveOrder } from './orders/approve-order'
import { dispatchOrder } from './orders/dispatch-order'
import { getProfile } from './authentication/get-profile'
import { getOrderDetails } from './orders/get-order-details'
import { getMonthRevenue } from './metrics/get-month-revenue'
import { sendAuthLink } from './authentication/send-auth-link'
import { getPopularProducts } from './metrics/get-popular-products'
import { getDayOrdersAmount } from './metrics/get-day-orders-amount'
import { registerRestaurant } from './restaurant/register-restaurants'
import { getMonthOrdersAmount } from './metrics/get-month-orders-amount'
import { getManagedRestaurant } from './restaurant/get-managed-restaurant'
import { authenticateFromLink } from './authentication/authenticate-from-link'
import { getDailyRevenueInPeriod } from './metrics/get-daily-revenue-in-period'
import { getMonthCanceledOrdersAmount } from './metrics/get-month-canceled-orders-amount'

export const routes = new Elysia()
  .use(signOut)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(getOrderDetails)
  .use(cancelOrder)
  .use(approveOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(listOrders)
  .use(getMonthRevenue)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyRevenueInPeriod)
