import Elysia from 'elysia'
import { auth } from '../auth'

export const signOut = new Elysia()
  .use(auth)
  .get('/sign-out', ({ signOut: internalSignOut }) => {
    internalSignOut()
  })
