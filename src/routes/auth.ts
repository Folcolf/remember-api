import { Hono } from 'hono'

import { isLogged, login, register } from '../controllers/auth'

const router = new Hono()

router.post('/login', login)
router.post('/register', register)
router.get('/logged', isLogged)

export default { router }
