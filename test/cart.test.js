import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('GET /carts/:id', () => {

  it('should return 404 if cart not found', async () => {
    const id = '654a6791a320a0f05d0b5e98';
    const { statusCode } = await requester.get(`carts/${id}`);

    expect(statusCode).to.be.equal(404);
  });

  it('should get cart with given ID', async () => {
    const user = {
      email: "ring.martin@gmail.com",
      password: "123456"
    };

    const { statusCode: loginStatusCode, headers } = await requester.post('/users/login').send(user);

    expect(loginStatusCode).to.equal(200);
    expect(headers).to.have.property('set-cookie');
    expect(headers['set-cookie']).to.satisfy(cookies => {
      return cookies.some(cookie => cookie.includes('ecommerce-token'));
    });

    const authToken = headers['set-cookie'][0].split(';')[0].split('=')[1];

    const id = '654a6791a320a0f05d0b5e91';
    const { statusCode, _body } = await requester.get(`/carts/${id}`).set('Cookie', `ecommerce-token=${authToken}`);

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property('_id');
    expect(_body).to.have.property('totalQuantity');
    expect(_body).to.have.property('totalPrice');
    expect(_body).to.have.property('products');
  });
});

describe('POST /carts/:cid/product/:pid', () => {
  it('should add product with given ID to cart', async () => {
    const user = {
      email: "martin@gmail.com",
      password: "123456"
    };

    const { statusCode: loginStatusCode, headers } = await requester.post('/users/login').send(user);

    expect(loginStatusCode).to.equal(200);
    expect(headers).to.have.property('set-cookie');
    expect(headers['set-cookie']).to.satisfy(cookies => {
      return cookies.some(cookie => cookie.includes('ecommerce-token'));
    });

    const authToken = headers['set-cookie'][0].split(';')[0].split('=')[1];

    const pid = '656207fc9f06b0c3f9610885';
    const cid = '654a6791a320a0f05d0b5e91';

    const { statusCode, _body } = await requester.post(`/carts/${cid}/product/${pid}`).set('Cookie', `ecommerce-token=${authToken}`).send({ quantity: 1 });;

    expect(statusCode).to.equal(200);
    expect(_body).to.have.property('cart').to.be.an('object');
  })
})