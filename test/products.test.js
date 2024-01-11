import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { productService } from '../src/services/index.js';

describe('products router PUT', () => {

  it('should update product when valid id and data is passed', async () => {
    const updatedProduct = { name: 'Updated Product' };
    productService.update.resolves(updatedProduct);
    
    const response = await request(app)
      .put('http://localhost:8080/api/products/65255675462c2469fcf6d257')
      .send(updatedProduct);

    expect(response.statusCode).to.equal(200);
    expect(response.body.product).to.deep.equal(updatedProduct);
  });

  it('should return 404 if invalid id passed', async () => {
    const response = await request(app)
      .put('/products/invalid')
      .send({ name: 'Product' });

    expect(response.statusCode).to.equal(404);
  });

  it('should return 400 if invalid data passed', async () => {
    const response = await request(app)
      .put('/products/123')
      .send({ invalid: 'data' });

    expect(response.statusCode).to.equal(400);
  });

});