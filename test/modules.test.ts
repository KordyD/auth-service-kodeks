import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { faker } from '@faker-js/faker';
import { app } from '../src';
import { setup, teardown } from './setup';
import { Prisma } from '@prisma/client';

chai.use(chaiHttp);
describe('Modules test collection', () => {
  let authToken = '';
  type Service = Prisma.PromiseReturnType<typeof setup>['testService'];
  type Module = Prisma.PromiseReturnType<typeof setup>['testModule'];
  let testService: Service;
  let testModule: Module;

  before(async () => {
    const test = await setup();
    testService = test.testService;
    testModule = test.testModule;
    const res = await chai.request(app).post('/auth/login').send({
      login: 'admin',
      password: '12345',
    });
    authToken = res.body.token;
  });

  it('Creates service', async () => {
    const service = {
      name: faker.person.jobDescriptor(),
    };
    const res = await chai
      .request(app)
      .post('/services/create')
      .auth(authToken, { type: 'bearer' })
      .send(service);
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/services/${res.body.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.not.null;
  });

  it('Gets modules for service', async () => {
    const res = await chai
      .request(app)
      .get(`/modules/${testService.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body.some((module: Module) => module.name === testModule.name))
      .to.be.true;
  });

  it('Creates module', async () => {
    const module = {
      name: faker.person.jobDescriptor(),
      service_id: testService.id,
    };
    const res = await chai
      .request(app)
      .post('/modules/create')
      .auth(authToken, { type: 'bearer' })
      .send(module);
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/modules/${res.body.service_id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.not.null;
  });

  it('Deletes module', async () => {
    const res = await chai
      .request(app)
      .delete(`/modules/delete/${testModule.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/modules/${testModule.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.empty;
  });

  it('Returns error if unathorized for module', async () => {
    const resModule = await chai.request(app).get(`/modules/${testService.id}`);
    expect(resModule.status).to.be.equal(401);
  });

  it('Deletes service', async () => {
    const res = await chai
      .request(app)
      .delete(`/services/delete/${testService.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(res).to.have.status(200);
    expect(res.body).to.be.not.empty;
    const findRes = await chai
      .request(app)
      .get(`/services/${testService.id}`)
      .auth(authToken, { type: 'bearer' });
    expect(findRes.body).to.be.null;
  });

  it('Returns error if unathorized for service', async () => {
    const resService = await chai.request(app).get('/services/');
    expect(resService.status).to.be.equal(401);
  });

  after(teardown);
});
