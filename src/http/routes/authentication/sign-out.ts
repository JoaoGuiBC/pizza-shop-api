import { Elysia } from 'elysia'

import { auth } from '../../auth'

const routeSchema = {
  detail: {
    summary: 'Sign out current user',
    tags: ['authentication'],
  },
}

export const signOut = new Elysia().use(auth).post(
  '/sign-out',
  ({ signOut: internalSignOut }) => {
    internalSignOut()
  },
  routeSchema,
)
