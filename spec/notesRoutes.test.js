const request = require('supertest')
const app = require('../src/app')
const {
    IdMismatchError,
    InvalidNoteTitleError,
    InvalidNoteContentError,
} = require('../src/common/errors')
const { init, setupTest } = require('../src/common/database')

const contentTypeHeader = 'content-type'
const locationHeader = 'location'

describe('routes/notes', () => {
    beforeAll(async () => {
        await init()
    })

    beforeEach(async () => {
        await setupTest()
    })

    it('should call GET /notes and respond with 200 json', async () => {
        const response = await request(app).get('/notes')
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
    })

    it('should call GET /notes/1 and respond with 200 json', async () => {
        const response = await request(app).get('/notes/1')
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.statusCode).toBe(200)
        expect(response.body.id).not.toBeUndefined()
        expect(response.body.title).not.toBeUndefined()
        expect(response.body.content).not.toBeUndefined()
    })

    it('should call GET /notes/3 and respond with 404 json', async () => {
        const response = await request(app).get('/notes/3')
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.statusCode).toBe(404)
        expect(response.body).toBeNull()
    })

    it('should call POST /notes and respond with 201 json', async () => {
        const response = await request(app)
            .post('/notes')
            .send({ title: 'Titolo 3', content: 'Contenuto 3' })
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.headers[locationHeader]).toBe(
            response.request.url + '/' + response.body.id
        )
        expect(response.statusCode).toBe(201)
        expect(response.body.id).not.toBeUndefined()
        expect(response.body.title).not.toBeUndefined()
        expect(response.body.content).not.toBeUndefined()
    })

    it('should call POST /notes and respond with 400 if title is not valid', async () => {
        const response = await request(app)
            .post('/notes')
            .send({ title: '', content: 'Contenuto' })
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe(new InvalidNoteTitleError().toString())
    })

    it('should call POST /notes and respond with 400 if content is not valid', async () => {
        const response = await request(app)
            .post('/notes')
            .send({ title: 'Titolo', content: '' })
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe(new InvalidNoteContentError().toString())
    })

    it('should call PUT /notes/2 and respond with 204', async () => {
        const response = await request(app)
            .put('/notes/2')
            .send({ id: 2, title: 'Nuovo titolo', content: 'Nuovo contenuto' })
        expect(response.statusCode).toBe(204)
    })

    it('should call PUT /notes/3 and respond with 201 json', async () => {
        const response = await request(app)
            .put('/notes/3')
            .send({ id: 3, title: 'Titolo 3', content: 'Contenuto 3' })
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.headers[locationHeader]).toBe(response.request.url)
        expect(response.statusCode).toBe(201)
    })

    it('should call PUT /notes/3 and respond with 400 when there is an id mismatch between route and payload', async () => {
        const response = await request(app)
            .put('/notes/3')
            .send({ id: 2, title: '', content: '' })
        expect(response.statusCode).toBe(400)
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.body).toBe(new IdMismatchError().toString())
    })

    it('should call PUT /notes and respond with 400 if title is not valid', async () => {
        const response = await request(app)
            .put('/notes/2')
            .send({ id: 2, title: '', content: 'Contenuto' })
        expect(response.statusCode).toBe(400)
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.body).toBe(new InvalidNoteTitleError().toString())
    })

    it('should call PUT /notes and respond with 400 if content is not valid', async () => {
        const response = await request(app)
            .put('/notes/2')
            .send({ id: 2, title: 'Titolo', content: '' })
        expect(response.statusCode).toBe(400)
        expect(response.headers[contentTypeHeader]).toMatch(/json/)
        expect(response.body).toBe(new InvalidNoteContentError().toString())
    })
})
