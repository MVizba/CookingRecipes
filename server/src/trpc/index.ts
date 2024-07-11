import { initTRPC } from '@trpc/server'
import type { Request, Response } from 'express'
import type { AuthUser } from '@server/entities/user'
import type { Database } from '@server/database'
import type * as entities from '@server/entities'
import type { Repository } from 'typeorm'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

type Entities = typeof entities

export type Context = {
  db: Database

  req?: Request
  res?: Response

  authUser?: AuthUser

  repos?: {
    [K in keyof Entities]?: Repository<InstanceType<Entities[K]>>
  }
}

export type ContextMinimal = Pick<Context, 'db'>

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts

    if (error.cause instanceof ZodError) {
      const validationError = fromZodError(error.cause)

      return {
        ...shape,
        data: {
          message: validationError.message,
        },
      }
    }

    return shape
  },
})

export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure: publicProcedure,
  router,
} = t
