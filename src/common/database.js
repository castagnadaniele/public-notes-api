const { Sequelize } = require('sequelize')
const waitPort = require('wait-port')
const { initNotes, Note } = require('../models/notesModel')

let sequelize

async function init() {
    if (process.env.MYSQL_HOST) {
        sequelize = await initMySQL()
    } else {
        sequelize = initSQLite()
    }
    initNotes(sequelize)
    await sequelize.sync()
}

async function setupTest() {
    await dropNotesTable()
    await sequelize.sync()

    await Note.create({
        title: 'Titolo 1',
        content: 'Contenuto 1',
    })

    await Note.create({
        title: 'Titolo 2',
        content: 'Contenuto 2',
    })
}

async function dropNotesTable() {
    await Note.drop()
}

async function initMySQL() {
    const host = process.env.MYSQL_HOST
    const username = process.env.MYSQL_USER
    const password = process.env.MYSQL_PASSWORD
    const database = process.env.MYSQL_DB
    await waitPort({ host: host, port: 3306 })
    return new Sequelize(database, username, password, {
        host: host,
        dialect: 'mysql',
    })
}

function initSQLite() {
    return new Sequelize('sqlite::memory:', { logging: false })
}

module.exports = {
    init,
    setupTest,
    dropNotesTable,
}
