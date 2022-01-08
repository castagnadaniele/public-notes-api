class InvalidNoteTitleError extends Error {
    constructor() {
        super('Note title is required.')
    }
}

class InvalidNoteContentError extends Error {
    constructor() {
        super('Note content is required.')
    }
}

class IdMismatchError extends Error {
    constructor() {
        super('Id mismatch')
    }
}

class NoRecordUpdatedError extends Error {
    constructor(id, tableName) {
        super(
            `Did not found a record to update for table ${tableName} with id ${id}`
        )
    }
}

module.exports = {
    InvalidNoteTitleError,
    InvalidNoteContentError,
    IdMismatchError,
    NoRecordUpdatedError,
}
