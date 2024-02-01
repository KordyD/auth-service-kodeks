import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import { setup, teardown } from './setup';
import { Prisma } from '@prisma/client';
import { prisma } from '../src/db';

chai.use(chaiHttp);
describe('User test collection', () => {
  let authToken = '';
  type User = Prisma.PromiseReturnType<typeof setup>['testUser'];
  let testUser: User;

  before(async () => {
    testUser = (await setup()).testUser;
    const res = await chai.request(app).post('/auth/login').send({
      login: 'admin',
      password: '12345',
    });
    authToken = res.body.token;
  });

  it('Returns all users', async () => {
    const res = await chai
      .request(app)
      .get('/users/')
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((user: User) => user.login === testUser.login)).to.be
      .true;
  });

  it('Returns all users with search query', async () => {
    const res = await chai
      .request(app)
      .get(`/users/?search=${testUser.login}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((user: User) => user.login === testUser.login)).to.be
      .true;
  });

  it('Returns user with id', async () => {
    const res = await chai
      .request(app)
      .get(`/users/${testUser.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('login').that.equals(testUser.login);
  });

  it('Creates user', async () => {
    const user = {
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      department: 'test1',
      first_name: faker.person.firstName(),
    };
    const res = await chai
      .request(app)
      .post('/users/create')
      .auth(authToken, { type: 'bearer' })
      .send(user);
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const userData = await prisma.users.findFirst({
      where: { id: res.body.id },
    });
    expect(userData).to.be.not.null;
  });

  it('Deletes user', async () => {
    const res = await chai
      .request(app)
      .delete(`/users/delete/${testUser.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const userData = await prisma.users.findFirst({
      where: { id: testUser.id },
    });
    expect(userData).to.be.null;
  });

  it('Returns error if unathorized', async () => {
    const res = await chai.request(app).get('/users/');
    expect(res.status).to.be.equal(401);
  });

  after(teardown);
});
