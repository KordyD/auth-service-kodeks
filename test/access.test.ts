import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import { setup, teardown } from './setup';
import { Prisma } from '@prisma/client';

chai.use(chaiHttp);
describe('Access provider test collection', () => {
  let authToken = '';
  type Access = Prisma.PromiseReturnType<typeof setup>['testAccess'];
  type User = Prisma.PromiseReturnType<typeof setup>['testUser'];
  type Group = Prisma.PromiseReturnType<typeof setup>['testGroup'];
  type Module = Prisma.PromiseReturnType<typeof setup>['testModule'];
  let testAccess: Access;
  let testUser: User;
  let testGroup: Group;
  let testModule: Module;

  before(async () => {
    const test = await setup();
    testAccess = test.testAccess;
    testUser = test.testUser;
    testGroup = test.testGroup;
    testModule = test.testModule;
    const res = await chai.request(app).post('/auth/login').send({
      login: 'admin',
      password: '12345',
    });
    authToken = res.body.token;
  });

  it('Gets access for module', async () => {
    const res = await chai
      .request(app)
      .get(`/access/${testModule.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((access: Access) => access.group_id === testGroup.id))
      .to.be.true;
  });

  it('Provides access for user', async () => {
    const access = {
      module_id: testModule.id,
      user_id: testUser.id,
    };
    const res = await chai
      .request(app)
      .post('/access/provide')
      .auth(authToken, { type: 'bearer' })
      .send(access);
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/access/${testModule.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(
      findRes.body.some((access: Access) => access.user_id === testUser.id)
    ).to.be.true;
  });

  it('Deletes access from group', async () => {
    const res = await chai
      .request(app)
      .delete(`/access/delete`)
      .auth(authToken, { type: 'bearer' })
      .send({ module_id: testModule.id, group_id: testGroup.id });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/access/${testModule.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(
      findRes.body.some((access: Access) => access.group_id === testGroup.id)
    ).to.be.false;
  });

  it('Returns error if unathorized', async () => {
    const findRes = await chai.request(app).get(`/access/${testModule.id}`);
    expect(findRes.status).to.be.equal(401);
  });

  after(teardown);
});
