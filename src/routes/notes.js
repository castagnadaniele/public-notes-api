const express = require('express')
const {
    IdMismatchError,
    InvalidNoteTitleError,
    InvalidNoteContentError,
} = require('../common/errors')
const NotesController = require('../controllers/notesController')
const NotesService = require('../services/notesService')
const router = express.Router()

const locationHeader = 'Location'

router.get('/', async (req, res) => {
    const notesController = initController()
    const notes = await notesController.getAll()
    res.status(200).json(notes)
})

router.get('/:id(\\d+)', async (req, res) => {
    const notesController = initController()
    const id = Number.parseInt(req.params.id)
    const note = await notesController.getById(id)
    res.status(note ? 200 : 404).json(note)
})

router.post('/', async (req, res) => {
    const notesController = initController()
    try {
        const note = await notesController.post(req.body)
        res.status(201)
            .setHeader(locationHeader, getLocation(req, note.id))
            .json(note)
    } catch (error) {
        let status = 500
        if (
            error instanceof InvalidNoteTitleError ||
            error instanceof InvalidNoteContentError
        ) {
            status = 400
        }
        res.status(status).json(error.toString())
    }
})

router.put('/:id(\\d+)', async (req, res) => {
    const notesController = initController()
    try {
        const id = Number.parseInt(req.params.id)
        const created = await notesController.put(id, req.body)
        if (created) {
            res.setHeader(locationHeader, getLocation(req, id))
        }
        res.status(created ? 201 : 204).json()
    } catch (error) {
        let status = 500
        if (
            error instanceof IdMismatchError ||
            error instanceof InvalidNoteTitleError || 
            error instanceof InvalidNoteContentError
        ) {
            status = 400
        }
        res.status(status).json(error.toString())
    }
})

function initController() {
    const queryService = new NotesService()
    return new NotesController(queryService)
}

function getLocation(req, id) {
    return `${req.protocol}://${req.get('host')}/notes/${id}`
}

module.exports = router
