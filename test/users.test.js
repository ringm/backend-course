import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('POST login', () => {

  it('should login user', async () => {
    const user = {
      email: "martin@gmail.com",
      password: "123456"
    };

    const { statusCode, _body } = await requester.post('/users/login').send(user);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.have.property('message').to.be.equal('Log in successfull');
  })

  it('should return 400 when credentials are wrong', async () => {
    const user = {
      email: "martin@gmail.com",
      password: "111"
    };

    const { statusCode } = await requester.post('/users/login').send(user);

    expect(statusCode).to.be.equal(400);
  })
});

describe('POST /signup', () => {
  it('should return 400 when email is already registered', async () => {
    const user = {
      first_name: "martin",
      last_name: "perez",
      age: 18,
      email: "martin.perez@gmail.com",
      password: "123456",
      role: "user"
    }

    const { statusCode } = await requester.post('/users/signup').send(user);
    expect(statusCode).to.be.equal(400);
  })
})