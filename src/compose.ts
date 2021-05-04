type Middleware = (ctx: any, next: Function) => Promise<void>

function compose(middleware: Middleware[]) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!')

  if(middleware.some(fn => typeof fn !== 'function'))
    throw new TypeError('Middleware must be composed of functions!')

  return function <T = object>(context: T, next?: Function): Promise<void> {
    let index = -1
    
    return dispatch(0)
    
    function dispatch(i: number): Promise<any> {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'))
      index = i

      let fn: Function = middleware[i]

      if (next && i === middleware.length) fn = next
      if (!fn) return Promise.resolve()

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

export default compose