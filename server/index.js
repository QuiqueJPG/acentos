import Debug from 'debug'
import app from './app'
import mongoose from 'mongoose'
import { mongoUrl } from './config'

const PORT = 3000
const debug = new Debug('acentos:root')

mongoose.Promise = global.Promise // Se le agrega el sistema de promesas de es2015 a mongoose

async function start () {

	debug(`Db url: ${mongoUrl}`)
	console.log(`Db url: ${mongoUrl}`)

	await mongoose.connect(mongoUrl)

	app.listen(PORT, () => {
		debug(`Server running at port ${PORT}`)
	})
}

start()