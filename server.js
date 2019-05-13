const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:a2034bbc-10fc-49bb-b81a-f385c940fede',
	key: '6154cd4b-b4f4-49e3-b9a8-0560e873bcd8:6O9cuT2Ld48/QNFJUHInHBfXHSicUU3UiaNWTod/0Lo='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
	const { username } = req.body
	chatkit.createUser({
		id: username,
		name: username
	})
		.then(() => res.sendStatus(201))
		.catch(error => {
			if (error.error_type === 'services/chatkit/user_already_exists') {
				res.sendStatus(200)
			} else {
				res.status(error.statusCode).json(error)
			}
		})
})

app.post('/authenticate', (req, res) => {
	const authData = chatkit.authenticate({ userId: req.query.user_id })
	res.status(authData.status).send(authData.body)
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
