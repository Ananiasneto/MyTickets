import httpStatus from "http-status";
import app from "index";
import supertest from "supertest";
 
const api=supertest(app);

describe("get /health",()=>{
    it("should return status 200 and a message",async()=>{
        const {status,text }=await api.get("/health");
        expect(status).toBe(httpStatus.OK);
        expect(text).toBe("I'm okay!")
    })
})