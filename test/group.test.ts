import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import { setup, teardown } from './setup';
import { Prisma } from '@prisma/client';

chai.use(chaiHttp);
describe('Group test collection', () => {
  let authToken = '';
  type User = Prisma.PromiseReturnType<typeof setup>['testUser'];
  type Group = Prisma.PromiseReturnType<typeof setup>['testGroup'];
  let testUser: User;
  let testGroup: Group;

  before(async () => {
    const test = await setup();
    testGroup = test.testGroup;
    testUser = test.testUser;
    const res = await chai.request(app).post('/auth/login').send({
      login: 'admin',
      password: '12345',
    });
    authToken = res.body.token;
  });

  it('Returns all groups', async () => {
    const res = await chai
      .request(app)
      .get('/groups/')
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((group: Group) => group.name === testGroup.name)).to.be
      .true;
  });

  it('Returns all groups with search query', async () => {
    const res = await chai
      .request(app)
      .get(`/groups/?search=${testGroup.name}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((group: Group) => group.name === testGroup.name)).to.be
      .true;
  });

  it('Returns group with id', async () => {
    const res = await chai
      .request(app)
      .get(`/groups/${testGroup.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('name').that.equals(testGroup.name);
  });

  it('Creates group', async () => {
    const group = {
      name: faker.person.jobDescriptor(),
    };
    const res = await chai
      .request(app)
      .post('/groups/create')
      .auth(authToken, { type: 'bearer' })
      .send(group);
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/groups/${res.body.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.not.null;
  });

  it('Adds user to group', async () => {
    const res = await chai
      .request(app)
      .post(`/groups/add-user/${testGroup.id}/${testUser.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/groups/${testGroup.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(
      findRes.body.users_groups.some(
        (user: { users: User }) => user.users.login === testUser.login
      )
    ).to.be.true;
  });

  it('Deletes group', async () => {
    const res = await chai
      .request(app)
      .delete(`/groups/delete/${testGroup.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/groups/${testGroup.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.null;
  });

  it('Returns error if unathorized', async () => {
    const res = await chai.request(app).get('/groups/');
    expect(res.status).to.be.equal(401);
  });

  after(teardown);
});
