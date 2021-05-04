const { compose } = require('../dist')
const test = require('ava')

test('will mutate initial context twice', async t => {

  const fns = compose([
    async (ctx, next) => {
      ctx.x++
      await next()
    },
    async ctx => {
      ctx.x += 2
      return ctx
    },
  ])
  
  const context = {
    x: 1,
  }
  
  await fns(context)

  t.is(context.x, 4)
})
