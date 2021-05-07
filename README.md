# Lambdaware

A simple utility library to add koa-like middlewares to serverless functions. Currently in early development.

## Proposed API

```ts
import { handleHttpEvent } from 'lambdaware'

const handler = handleHttpEvent([
  ...middleware,
  async (ctx: HttpContext): Promise<void> => {
    // handle event
  }
])

// where HttpContext would look like

type Body = any
type Params = Record<string, any>
type Query = Record<string, any>
type Headers = Record<string, any>

interface Request<B = Body, P = Params, Q = Query, H = Headers> {
  body: B
  params: P
  query: Q
  headers: H
}

interface HttpContext<B, P, Q, H> {
  // parsed request
  req: Request<B, P, Q, H>

  // response
  status: number
  body: any
  headers: any

  // aws raw event
  aws: {
    event: APIGatewayProxyEvent
    context: Context
  }
}

```