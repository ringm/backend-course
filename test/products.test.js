import supertest from 'supertest';
import { expect } from 'chai';

const requester = supertest('http://localhost:8080/api');

describe('GET products', () => {

  it('should return list of available products', async () => {

    const { statusCode, _body } = await requester.get('/products');

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.be.an('array');
    _body.payload.forEach(product => {
      expect(product).to.have.property('_id');
      expect(product).to.have.property('name');
      expect(product).to.have.property('price');
    })
  });
});

describe('GET /:pid', () => {

  it('should return product with given ID', async () => {
    const pid = '65255675462c2469fcf6d257'
    const { statusCode, _body } = await requester.get(`/products/${pid}`);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.be.an('object');
    expect(_body).to.have.property('_id');
    expect(_body).to.have.property('name');
    expect(_body).to.have.deep.property('price');
  });

  it('should return 404 when product is not found', async () => {
    const pid = '65255675462c2469fcf6d258'
    const { statusCode } = await requester.get(`/products/${pid}`);

    expect(statusCode).to.be.equal(404);
  });
})

describe('POST create product', () => {
  it('should create product with auth user', async () => {
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

    const product = {
      name: "Campera Impermeable",
      description: "Campera nike rompeviento",
      price: 5900,
      code: Math.random().toString(36).substr(2, 10),
      thumbnails: [],
      stock: 2,
      status: true,
      category: "jackets"
    }
    const { statusCode, _body } = await requester.post('/products').set('Cookie', `ecommerce-token=${authToken}`).send(product);

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.have.property('_id');  
    expect(_body.payload).to.have.property('name');  
    expect(_body.payload).to.have.property('price');  
  })

  it('should return 403 to unauthorized users trying to create a product', async () => {
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

    const product = {
      name: "Campera Impermeable",
      description: "Campera nike rompeviento",
      price: 5900,
      code: Math.random().toString(36).substr(2, 10),
      thumbnails: [],
      stock: 2,
      status: true,
      category: "jackets"
    }
    
    const { statusCode } = await requester.post('/products').set('Cookie', `ecommerce-token=${authToken}`).send(product);

    expect(statusCode).to.equal(403);
  })

  it('should return 401 to public requests', async () => {
    const product = {
      name: "Campera Impermeable",
      description: "Campera nike rompeviento",
      price: 5900,
      code: Math.random().toString(36).substr(2, 10),
      thumbnails: [],
      stock: 2,
      status: true,
      category: "jackets"
    }
    
    const { statusCode } = await requester.post('/products').send(product);

    expect(statusCode).to.equal(401);
  })
})

