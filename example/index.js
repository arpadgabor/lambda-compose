import { compose } from 'lambdaware'

const handler = compose([
  async (ctx, next) => {
    ctx.number++
    await next()
  },
  async (ctx) => {
    ctx.number += 10
  }
])

const ctx = { number: 0 }

handler(ctx)

console.log(ctx)