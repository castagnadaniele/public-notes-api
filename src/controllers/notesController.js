const {
    InvalidNoteTitleError,
    InvalidNoteContentError,
    IdMismatchError,
} = require('../common/errors')

class NotesController {
    constructor(queryService) {
        this.queryService = queryService
    }

    async getAll() {
        return await this.queryService.getAll()
    }

    async getById(id) {
        return await this.queryService.getById(id)
    }

    async post(note) {
        this.#validateNote(note)
        return await this.queryService.insert(note)
    }

    async put(id, note) {
        if (id !== note.id) {
            throw new IdMismatchError()
        }
        this.#validateNote(note)
        const { created } = await this.queryService.findOrCreate(note)
        if (!created) {
            await this.queryService.update(note)
        }
        return created
    }

    #validateNote(note) {
        if (!note.title) {
            throw new InvalidNoteTitleError()
        }
        if (!note.content) {
            throw new InvalidNoteContentError()
        }
    }
}

module.exports = NotesController
