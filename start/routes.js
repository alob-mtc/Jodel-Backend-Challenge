import Router from 'koa-router'
import { listBooks, storeBook } from '../controllers/BookController'
const router = new Router()

router.prefix('/v1')
router.get('/health', async ctx => {
  ctx.body = { message: 'healthy' }
})
router.get('/books', listBooks)
router.post('/books', storeBook)

export const allowedMethods = () => router.allowedMethods()
export default () => router.routes()
