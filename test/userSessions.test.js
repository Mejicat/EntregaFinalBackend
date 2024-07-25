import request from 'supertest';
import { expect } from 'chai';

import app from '../src/app.js';
import { userRepository } from '../src/repositories/index.js';

const testUser = { first_name: 'Lucas', last_name: 'Gatto', email: 'lucasgatto@gmail.com', age: 25, password: 'abc123' };
let cookie;
describe("Tests Users", () => {

    after(async () => {
        //logout the user and delete de user from de database
        await request(app).get("/logout");
        await userRepository.deleteUserByEmail(testUser.email);
    })

    it("POST /api/sessions/register deberia registrar un usuario",async () => {
        const res = await request(app).post("/api/sessions/register").send(testUser)
        const users = await userRepository.getUsers();
        expect(users).to.be.an('array');
    })

    it("POST /api/sessions/login deberia loguear un usuario",async () => {
        const result = await request(app).post("/api/sessions/login").send({email: testUser.email, password: testUser.password})
        const cookieData = result.headers['set-cookie'][0];
        cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };
        expect(cookieData).to.be.ok;
        expect(cookie.name).to.be.equals('auth');
        expect(cookie.value).to.be.ok;
    })

    it("GET /api/sessions/current deberia devolver el usuario logueado",async () => {
        const res = await request(app).get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(res).to.be.ok;
    })
})