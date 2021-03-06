const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const notesRouter = require('./routes/notes')
const errorHandler = require('./routes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/notes', notesRouter)

app.use(errorHandler)

module.exports = app
