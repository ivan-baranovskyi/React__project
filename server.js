const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const cors = require('cors')

server.use(cors())
server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/register', (req, res) => {
	const { email, username } = req.body
	const db = router.db
	const users = db.get('users').value()
	const userExists = users.some(user => user.email === email)
	if (userExists) {
		return res.status(400).json({ error: 'User already exists' })
	}
	const id = Math.random().toString(36).substr(2, 9)
	const createdAt = new Date().toISOString()
	db.get('users').push({ id, email, username, role: 'user', createdAt }).write()
	const token = `mock-token-${id}`
	res.json({ token })
})

server.use((req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]
	if (req.method !== 'POST' || req.path !== '/register') {
		if (!token || !token.startsWith('mock-token-')) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
	}
	next()
})

server.use(router)
server.listen(3001, () => {
	console.log('JSON Server is running on port 3001')
})
