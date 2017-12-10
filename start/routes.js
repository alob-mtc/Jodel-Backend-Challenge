import Router from 'koa-router'
import { listBooks, storeBook } from '../controllers/BookController'
const router = new Router()

router.get('/health', async ctx => {
  ctx.body = 'Healthy'
})

router.prefix('/v1')
router.get('/books', listBooks)
router.post('/books', storeBook)

export const allowedMethods = () => router.allowedMethods()
export default () => router.routes()
