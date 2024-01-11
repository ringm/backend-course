import { expect } from 'chai';
import { usersRouter } from '../routes/users.router';

describe('usersRouter', () => {

  describe('POST /signup', () => {

    it('should create a new user and cart', async () => {
      // mock request and response
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { 
        status: () => res,
        json: () => {}
      };

      // spy on cartService.create
      const cartService = {
        create: sinon.stub().resolves({ _id: 'cart123' })  
      };

      // call route handler
      await usersRouter.post('/signup', req, res);

      // assertions
      expect(cartService.create).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledOnce;
    });

  });

  describe('POST /login', () => {

    it('should login user and set token cookie', async () => {
      // mock request and response
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { 
        status: () => res,
        cookie: () => res,
        json: () => {}
      };

      // spy on userService.login
      const userService = {
        login: sinon.stub().resolves({ /* user */}),
        generateToken: sinon.stub().returns('token123')  
      };

      // call route handler
      await usersRouter.post('/login', req, res);

      // assertions
      expect(userService.login).to.have.been.calledOnce;
      expect(userService.generateToken).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.cookie).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledOnce;
    });

  });

});