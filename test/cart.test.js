import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';

describe('carts router POST /:cid/product/:pid', () => {

  it('should add product to cart', async () => {
    const response = await request(app)
      .post('/carts/123/product/456')
      .send({ quantity: 2 });
    
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('cart');
  });

  it('should return 404 if cart not found', async () => {
    const response = await request(app)
      .post('/carts/invalid/product/456');

    expect(response.statusCode).to.equal(404);
  });

  it('should return 400 if invalid quantity', async () => {
    const response = await request(app)
      .post('/carts/123/product/456')
      .send({ quantity: 'invalid' });

    expect(response.statusCode).to.equal(400);
  });

});