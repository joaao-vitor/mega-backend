require('dotenv').config()
const express = require('express')
const rotas = require('./routes')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const gameRouter = require('./routes/gameRouter')
const reviewRouter = require('./routes/reviewRouter')
const catProgressoRouter = require('./routes/catProgressoRouter')
const userProgressRouter = require('./routes/userProgressRouter')
const server = express()
const cookieParser = require('cookie-parser')

const cors = require('cors')
const morgan = require('morgan')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
})

server.use(fileUpload({ useTempFiles: true }));
server.use(morgan('tiny'))
server.use(express.json())
server.use(cors())
server.use(cookieParser(process.env.JWT_SECRET))
server.get('/', (req, res) => {
    return res.json({ mensagem: 'Nossa vou me matar' })
})

server.use('/api/jogos', rotas)
server.use('/api/auth', authRouter)
server.use('/api/user', userRouter)
server.use('/api/jogo', gameRouter)
server.use('/api/review', reviewRouter)
server.use('/api/catProgresso', catProgressoRouter)
server.use('/api/userProgress', userProgressRouter)

server.listen(3000, () => {
    console.log('funcionando')
})
