
import prisma from "database";
import app from "index";
import supertest from "supertest";
 
const api=supertest(app);

describe("get /events",()=>{

  beforeEach(async () => {
    await prisma.event.deleteMany()
  });

    it("should return an array of events",async()=>{
      await prisma.event.create({
        data:{
          name: "Evento de Teste",
        date: new Date("2025-05-01T00:00:00.000Z"),
        }
      })
      
        const {body }=await api.get("/events");
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              date: expect.any(String), 
            }),
          ]));
        })
    

    it("should return an especific event",async()=>{
      const {id}=await prisma.event.create({
        data:{
          name: "Evento de Teste",
        date: new Date("2025-05-01T00:00:00.000Z"),
        }
      })
        const {body }=await api.get(`/events/${id}`);
        expect(body).toEqual(
            expect.objectContaining({
              id: id,
              name: expect.any(String),
              date: expect.any(String), 
            }),
          );
    })
})