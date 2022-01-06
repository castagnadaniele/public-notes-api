const { Sequelize } = require('sequelize')
const { initNotes, Note } = require('../models/notesModel')
const NotesService = require('./notesService')
const { NoRecordUpdatedError } = require('../common/errors')

const sequelize = new Sequelize('sqlite::memory:', { logging: false })
const title1 = 'Titolo 1'
const content1 = 'Contenuto 1'
const title2 = 'Titolo 2'
const content2 = 'Contenuto 2'
const title3 = 'Titolo 3'
const content3 = 'Contenuto 3'

describe('notesService', () => {
    beforeAll(async () => {
        initNotes(sequelize)
        await sequelize.sync()
    })

    beforeEach(async () => {
        await Note.drop()
        await sequelize.sync()

        await Note.create({
            title: 'Titolo 1',
            content: 'Contenuto 1',
        })

        await Note.create({
            title: 'Titolo 2',
            content: 'Contenuto 2',
        })
    })

    it('should get all notes', async () => {
        const notesService = new NotesService()
        const notes = await notesService.getAll()
        expect(notes.length).toBe(2)
        expect(notes[0].title).toBe(title1)
        expect(notes[0].content).toBe(content1)
        expect(notes[1].title).toBe(title2)
        expect(notes[1].content).toBe(content2)
    })

    it('should get note with id 1', async () => {
        const notesService = new NotesService()
        const note = await notesService.getById(1)
        expect(note.id).toBe(1)
        expect(note.title).toBe(title1)
        expect(note.content).toBe(content1)
    })

    it('should not get note with id 3', async () => {
        const notesService = new NotesService()
        const note = await notesService.getById(3)
        expect(note).toBeNull()
    })

    it('should insert new note', async () => {
        const notesService = new NotesService()
        await notesService.insert({ title: title3, content: content3 })
        const note = await notesService.getById(3)
        expect(note.title).toBe(title3)
        expect(note.content).toBe(content3)
    })

    it('should create a new note if it does not exists', async () => {
        const notesService = new NotesService()
        const { note, created } = await notesService.findOrCreate({
            id: 3,
            title: title3,
            content: content3,
        })
        expect(note.id).toBe(3)
        expect(note.title).toBe(title3)
        expect(note.content).toBe(content3)
        expect(created).toBe(true)
    })

    it('should update an existing note', async () => {
        const notesService = new NotesService()
        const affectedRows = await notesService.update({
            id: 2,
            title: title3,
            content: content3,
        })
        const modifiedNote = await notesService.getById(2)
        expect(modifiedNote.title).toBe(title3)
        expect(modifiedNote.content).toBe(content3)
        expect(affectedRows).toBe(1)
    })

    it('should not update a note which does not exist', async () => {
        const notesService = new NotesService()
        await expect(
            notesService.update({
                id: 3,
                title: title3,
                content: content3,
            })
        ).rejects.toThrow(NoRecordUpdatedError)
    })
})
