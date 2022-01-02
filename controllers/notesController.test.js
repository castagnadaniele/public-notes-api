const sinon = require('sinon')
const { NotesController, InvalidNoteTitleError, InvalidNoteContentError, IdMismatchError } = require('./notesController')

describe('Notes Controller', () => {
    it('should call queryService.getAll one time', () => {
        const { controller, spy } = initControllerWithSpy('getAll');
        controller.getAll();
        expect(spy.calledOnce).toBe(true);
    });

    it('should call queryService.getById(1) one time', () => {
        const { controller, spy } = initControllerWithSpy('getById');
        controller.getById(1);
        expect(spy.calledOnce).toBe(true);
        expect(spy.args[0].length).toBe(1);
        expect(spy.args[0][0]).toBe(1);
    });

    it('should call queryService.post({title:\'Titolo\',content:\'Contenuto\'}) one time', () => {
        const { controller, spy } = initControllerWithSpy('post');
        controller.post({ title: 'Titolo', content: 'Contenuto' });
        expect(spy.calledOnce).toBe(true);
        expect(spy.args[0].length).toBe(1);
        expect(spy.args[0][0]).toEqual({ title: 'Titolo', content: 'Contenuto' });
    });

    it('should not call queryService.post and throw with invalid note title error', () => {
        const { controller, spy } = initControllerWithSpy('post');
        expect(() => {
            controller.post({ title: '', content: 'Contenuto' });
        }).toThrow(InvalidNoteTitleError);
        expect(spy.notCalled).toBe(true);
    });

    it('should not call queryService.post and throw with invalid note content error', () => {
        const { controller, spy } = initControllerWithSpy('post');
        expect(() => {
            controller.post({ title: 'Titolo', content: '' });
        }).toThrow(InvalidNoteContentError);
        expect(spy.notCalled).toBe(true);
    });

    it('should call queryService.put({id:1,title:\'Titolo\',content:\'Contenuto\'}) one time', () => {
        const { controller, spy } = initControllerWithSpy('put');
        controller.put(1, { id: 1, title: 'Titolo', content: 'Contenuto' });
        expect(spy.calledOnce).toBe(true);
        expect(spy.args[0].length).toBe(1);
        expect(spy.args[0][0]).toEqual({ id: 1, title: 'Titolo', content: 'Contenuto' });
    });

    it('should not call queryService.put and throw with id mismatch error', () => {
        const { controller, spy } = initControllerWithSpy('put');
        expect(() => {
            controller.put(2, { id: 1, title: 'Titolo', content: 'Contenuto' });
        }).toThrow(IdMismatchError);
        expect(spy.notCalled).toBe(true);
    });

    it('should not call queryService.put and throw with invalid note title error', () => {
        const { controller, spy } = initControllerWithSpy('put');
        expect(() => {
            controller.put(1, { id: 1, title: '', content: 'Contenuto' });
        }).toThrow(InvalidNoteTitleError);
        expect(spy.notCalled).toBe(true);
    });

    it('should not call queryService.put and throw with invalid note content error', () => {
        const { controller, spy } = initControllerWithSpy('put');
        expect(() => {
            controller.put(1, { id: 1, title: 'Titolo', content: '' });
        }).toThrow(InvalidNoteContentError);
        expect(spy.notCalled).toBe(true);
    });
});

function initControllerWithSpy(spyName) {
    const spy = sinon.spy();
    const queryService = {
        [spyName]: spy,
    }
    const controller = new NotesController(queryService);
    return {
        controller,
        spy
    }
}