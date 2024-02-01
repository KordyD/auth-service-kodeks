import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src';
import { setup, teardown } from './setup';

chai.use(chaiHttp);
describe('Auth test collection', () => {
  let authToken = '';

  before(setup);

  it('Returns auth token on login', async () => {
    const res = await chai.request(app).post('/auth/login').send({
      login: 'admin',
      password: '12345',
    });
    authToken = res.body.token;
    expect(authToken).to.be.not.empty;
  });

  it('Returns true on logout', async () => {
    const resLogout = await chai
      .request(app)
      .post('/auth/logout')
      .auth(authToken, { type: 'bearer' });
    expect(resLogout.body).to.be.true;
  });
  after(teardown);
});
