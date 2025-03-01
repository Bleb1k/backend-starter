import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

jest.setTimeout(18000000)
describe('Login endpoint', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('should return user for valid /google request', async () => {
    const testingGoogleMock = {
      name: 'John Doe',
      email: 'john@doe.com',
    }
    axiosMock
      .onGet('https://www.googleapis.com/oauth2/v3/userinfo?access_token=test')
      .reply(200, testingGoogleMock)
    const response = await request(server)
      .post('/login/google')
      .send({ accessToken: 'test' })
    expect(response.body.name).toBe(testingGoogleMock.name)
    expect(response.body.email).toBe(testingGoogleMock.email)
  })
})
