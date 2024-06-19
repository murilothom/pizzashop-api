import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getOrderDetails } from './routes/get-order-details'
import { approveOrder } from './routes/approve-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { cancelOrder } from './routes/cancel-order'
import { getOrders } from './routes/get-orders'
import { getMonthRevenue } from './routes/get-month-revenue'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getMonthOrdersAmount } from './routes/get-mount-orders-amount'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'
import { getPopularProducts } from './routes/get-popuplar-products'
import { getDailyRevenueInPeriod } from './routes/get-daily-revenue-in-period'
import { updateProfile } from './routes/update-profile'

const app = new Elysia()
  .use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(updateProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(cancelOrder)
  .use(getOrders)
  .use(getMonthRevenue)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyRevenueInPeriod)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status

        return error.toResponse()
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

app.listen(3333, () => {
  console.log('HTTP server is running!')
})
