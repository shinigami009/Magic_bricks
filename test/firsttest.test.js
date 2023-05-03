const request = require("supertest");

const app = require('../server');
const mongoose = require('mongoose');
const Property = require('../models/propertyModel');

let baseUrl = 'http://localhost:5001/api'

let token = null;
let email="sumanth@gmail.com";
let pass="sumanth";

beforeAll(async () => {
    jest.setTimeout(200000)
    let url = `${baseUrl}/users/login`;
    const res = await request(app)
      .post(url)
      .send({ "email": `${email}`, "password": `${pass}` })
      .set("accept", "application/json")
      .expect(200)
    let body = res.body.data;
    token = body.token.access_token;
  })

  test('Get /country - it gets list of all Country pages', async () => {
    let url = `${baseUrl}/property/all`;

    const res = await request(app)
        .post(url)
        .set("accept", "application/json")
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

})
// describe("NUmber operation",()=>{

//     test("1 plus 1 should be 2",()=>{
//         let a=1;
//         let b=2;
//         expect(a+b).toBe(3)
//     })
    
//     test("5 plus 6 should be 11",()=>{
//         let a=5;
//         let b=6;
//         expect(a+b).not.toBe(10)
//     })


// })

