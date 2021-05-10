const { compose } = require('../dist')
const test = require('ava').default

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || 1))
}

function isPromise(x) {
  return x && typeof x.then === 'function'
}

test('should work', async t => {
  const arr = []
  const stack = [
    async (_, next) => {
      arr.push(1)
      await wait(1)
      await next()
      await wait(1)
      arr.push(6)
    },
    async (_, next) => {
      arr.push(2)
      await wait(1)
      await next()
      await wait(1)
      arr.push(5)
    },
    async (_, next) => {
      arr.push(3)
      await wait(1)
      await next()
      await wait(1)
      arr.push(4)
    },
  ]

  await compose(stack)({})
  t.deepEqual(arr, [1, 2, 3, 4, 5, 6], 'array should contain all items')
})

test('should reject on errors in middleware', async t => {
  var stack = []

  stack.push(() => {
    throw new Error()
  })

  try {
    await compose(stack)({})
    throw new Error('promise was not rejected')
  } catch (e) {
    t.assert(e instanceof Error, 'error is not an instance of Error')
  }
})

test('should create next functions that return promises', async t => {
  const stack = []
  const arr = []
  for (let i = 0; i < 5; i++) {
    stack.push((_, next) => {
      arr.push(next())
    })
  }

  compose(stack)({})

  for (let next of arr) {
    if (!(next instanceof Promise)) {
      t.fail('next is not a promise')
    }
    t.pass()
  }
})

test('should keep context', t => {
  const ctx = {}

  const stack = []

  stack.push(async (ctx2, next) => {
    await next()
    t.deepEqual(ctx2, ctx)
  })

  stack.push(async (ctx2, next) => {
    await next()
    t.deepEqual(ctx2, ctx)
  })

  stack.push(async (ctx2, next) => {
    await next()
    t.deepEqual(ctx2, ctx)
  })

  return compose(stack)(ctx)
})

test('should return last return value', async t => {
  const stack = [
    async (_, next) => {
      const val = await next()
      t.is(val, 2)
      return 5 // <-- *
    },
    async (_, next) => {
      const val = await next()
      t.is(val, 0)
      return 2
    },
  ]

  const next = () => 0
  const result = await compose(stack)({}, next)

  t.is(result, 5) // <-- &
})
