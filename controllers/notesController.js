class NotesController {
    constructor(queryService) {
        this.queryService = queryService;
    }

    getAll() {
        return this.queryService.getAll();
    }

    getById(id) {
        return this.queryService.getById(id);
    }

    post(note) {
        this.#validateNote(note);
        return this.queryService.post(note);
    }

    put(id, note) {
        if (id !== note.id) {
            throw new IdMismatchError();
        }
        this.#validateNote(note);
        return this.queryService.put(note);
    }

    #validateNote(note) {
        if (!note.title) {
            throw new InvalidNoteTitleError();
        }
        if (!note.content) {
            throw new InvalidNoteContentError();
        }
    }
}

class InvalidNoteTitleError extends Error {
    constructor() {
        super('Note title is required.');
    }
}

class InvalidNoteContentError extends Error {
    constructor() {
        super('Note content is required.');
    }
}

class IdMismatchError extends Error {
    constructor() {
        super('Id mismatch');
    }
}

module.exports = {
    NotesController,
    InvalidNoteTitleError,
    InvalidNoteContentError,
    IdMismatchError
}