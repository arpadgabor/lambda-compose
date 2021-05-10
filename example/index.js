import { compose } from 'lambdaware'

const handler = compose([
  async (ctx, next) => {
    ctx.number++
    try {
      await next()
      ctx.str = 'my string'
    } catch (err) {
      Object.assign(ctx, { status: 404 })
      return ctx
    }
  },
  async (ctx) => {
    console.log(ctx)
    ctx.number += 10
    throw 'my error'
  }
])

const ctx = { number: 0 }

await handler(ctx)

console.log(ctx)