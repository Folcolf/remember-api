import { Hono } from 'hono'
import auth from './auth'

const router = new Hono()

router.route('/auth', auth.router)

export default router
