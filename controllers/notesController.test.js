const sinon = require('sinon')
const NotesController = require('./notesController')
const {
    InvalidNoteTitleError,
    InvalidNoteContentError,
    IdMismatchError,
} = require('../common/errors')

describe('notesController', () => {
    it('should call queryService.getAll one time', async () => {
        const { controller, spy } = initControllerWithSpy('getAll')
        await controller.getAll()
        expect(spy.calledOnce).toBe(true)
    })

    it('should call queryService.getById(1) one time', async () => {
        const { controller, spy } = initControllerWithSpy('getById')
        await controller.getById(1)
        expect(spy.calledOnce).toBe(true)
        expect(spy.args[0].length).toBe(1)
        expect(spy.args[0][0]).toBe(1)
    })

    it("should call queryService.insert({title:'Titolo',content:'Contenuto'}) one time", async () => {
        const { controller, spy } = initControllerWithSpy('insert')
        await controller.post({ title: 'Titolo', content: 'Contenuto' })
        expect(spy.calledOnce).toBe(true)
        expect(spy.args[0].length).toBe(1)
        expect(spy.args[0][0]).toEqual({
            title: 'Titolo',
            content: 'Contenuto',
        })
    })

    it("should call queryService.insert({title:'Titolo',content:'Contenuto'}) and get new inserted object", async () => {
        const fake = sinon.fake.returns({
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
        const queryService = {
            insert: fake,
        }
        const controller = new NotesController(queryService)
        const note = await controller.post({
            title: 'Titolo',
            content: 'Contenuto',
        })
        expect(note).toEqual({
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
    })

    it('should not call queryService.insert and throw with invalid note title error', async () => {
        const { controller, spy } = initControllerWithSpy('insert')
        await expect(
            controller.post({ title: '', content: 'Contenuto' })
        ).rejects.toThrow(InvalidNoteTitleError)
        expect(spy.notCalled).toBe(true)
    })

    it('should not call queryService.insert and throw with invalid note content error', async () => {
        const { controller, spy } = initControllerWithSpy('insert')
        await expect(
            controller.post({ title: 'Titolo', content: '' })
        ).rejects.toThrow(InvalidNoteContentError)
        expect(spy.notCalled).toBe(true)
    })

    it('should call queryService.findOrCreate one time and not call queryService.update when note does not exist', async () => {
        const findOrCreateFake = sinon.fake.returns({
            note: { id: 1, title: 'Titolo', content: 'Contenuto' },
            created: true,
        })
        const updateSpy = sinon.spy()
        const queryService = {
            findOrCreate: findOrCreateFake,
            update: updateSpy,
        }
        const controller = new NotesController(queryService)
        const created = await controller.put(1, {
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
        expect(created).toBe(true)
        expect(findOrCreateFake.calledOnce).toBe(true)
        expect(findOrCreateFake.args[0].length).toBe(1)
        expect(findOrCreateFake.args[0][0]).toEqual({
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
        expect(updateSpy.notCalled).toBe(true)
    })

    it('should call queryService.findOrCreate one time and call queryService.update when note exist', async () => {
        const findOrCreateFake = sinon.fake.returns({
            note: { id: 1, title: 'Titolo', content: 'Contenuto' },
            created: false,
        })
        const updateSpy = sinon.spy()
        const queryService = {
            findOrCreate: findOrCreateFake,
            update: updateSpy,
        }
        const controller = new NotesController(queryService)
        const created = await controller.put(1, {
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
        expect(created).toBe(false)
        expect(findOrCreateFake.calledOnce).toBe(true)
        expect(findOrCreateFake.args[0].length).toBe(1)
        expect(findOrCreateFake.args[0][0]).toEqual({
            id: 1,
            title: 'Titolo',
            content: 'Contenuto',
        })
        expect(updateSpy.calledOnce).toBe(true)
    })

    it('should not call queryService.findOrCreate and throw with id mismatch error', async () => {
        const { controller, spy } = initControllerWithSpy('findOrCreate')
        await expect(
            controller.put(2, {
                id: 1,
                title: 'Titolo',
                content: 'Contenuto',
            })
        ).rejects.toThrow(IdMismatchError)
        expect(spy.notCalled).toBe(true)
    })

    it('should not call queryService.findOrCreate and throw with invalid note title error', async () => {
        const { controller, spy } = initControllerWithSpy('findOrCreate')
        await expect(
            controller.put(1, { id: 1, title: '', content: 'Contenuto' })
        ).rejects.toThrow(InvalidNoteTitleError)
        expect(spy.notCalled).toBe(true)
    })

    it('should not call queryService.findOrCreate and throw with invalid note content error', async () => {
        const { controller, spy } = initControllerWithSpy('findOrCreate')
        await expect(
            controller.put(1, { id: 1, title: 'Titolo', content: '' })
        ).rejects.toThrow(InvalidNoteContentError)
        expect(spy.notCalled).toBe(true)
    })
})

function initControllerWithSpy(spyName) {
    const spy = sinon.spy()
    const queryService = {
        [spyName]: spy,
    }
    const controller = new NotesController(queryService)
    return {
        controller,
        spy,
    }
}
