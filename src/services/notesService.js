const { Note } = require('../models/notesModel')
const { NoRecordUpdatedError } = require('../common/errors')

class NotesService {
    async getAll() {
        const notes = await Note.findAll()
        return notes.map((n) => n.toJSON())
    }

    async getById(id) {
        const note = await Note.findByPk(id)
        return note ? note.toJSON() : note
    }

    async insert(note) {
        const newNote = await Note.create(note)
        return newNote.toJSON()
    }

    async findOrCreate(note) {
        const result = await Note.findOrCreate({
            where: { id: note.id },
            defaults: {
                title: note.title,
                content: note.content,
            },
        })
        return {
            note: result[0].toJSON(),
            created: result[1],
        }
    }

    async update(note) {
        const result = await Note.update(
            {
                title: note.title,
                content: note.content,
            },
            {
                where: {
                    id: note.id,
                },
            }
        )
        if (result[0] === 0) {
            throw new NoRecordUpdatedError(note.id, Note.tableName)
        }
        return result[0]
    }
}

module.exports = NotesService
