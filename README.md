# LambdaCompose

A simple utility library to add koa-like middlewares to serverless functions. Currently in early development.

## Proposed API

```ts
import { handleHttpEvent } from 'lambda-compose'

const handler = handleHttpEvent([
  ...middleware,
  async (ctx: HttpContext) => {
    // handle event
  }
])

// where HttpContext would look like

type Body = any
type Params = Record<string, any>
type Query = Record<string, any>
type Headers = Record<string, any>

interface ReqRes {
  body: B
  params: P
  query: Q
  headers: H
}

interface HttpContext<B = Body, P = Params, Q = Query, H = Headers> {
  req: ReqRes
  res: ReqRes & { status: number }

  // aws raw event
  aws: {
    event: APIGatewayProxyEvent
    context: Context
  }
}

```