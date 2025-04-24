import prisma from "database";
import httpStatus from "http-status";
import app from "index";
import supertest from "supertest";
 
const api=supertest(app);

describe("get /tickets",()=>{
    beforeEach(async () => {
        await prisma.event.deleteMany()
        
      });
    it("should return all tickets by eventId",async()=>{
        const event=await prisma.event.create({
            data:{
                name: "Evento de Teste",
                date: new Date("2025-05-01T00:00:00.000Z"),
                tickets:{
                    create: [
                      {
                        owner: "Ananias",
                        code: "ABC123",
                        used: false
                      },
                      {
                        owner: "João",
                        code: "XYZ789",
                        used: true
                      }
                    ]
                  }
            }
          })
          
        const {body }=await api.get(`/tickets/${event.id}`);
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              owner: expect.any(String),
              code: expect.any(String), 
              used: expect.any(Boolean), 
              eventId: event.id, 
            }),
          ]));
        })
    })
describe("post /tickets",()=>{
  beforeEach(async () => {
    await prisma.event.deleteMany()
 });
      
    it("should create ticket and return stts 200 and ticket",async()=>{
      const {id} = await prisma.event.create({
        data: {
        name: "Evento de Teste",
        date: new Date("2025-05-01T00:00:00.000Z"),
         },
      });
      const {body,status }=await api.post(`/tickets`).send({
        owner: "Ananias",
        code: "ABC123",
        eventId:id
      });
    
      expect(status).toBe(httpStatus.CREATED);

      expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
              owner: expect.any(String),
              code: expect.any(String), 
              used: expect.any(Boolean), 
              eventId: id, 
        }))
          })
      })
describe("PUT /tickets/use/:id", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany()
  });
  it("should update ticket by id and return status 204", async () => {
    const event = await prisma.event.create({
      data: {
        name: "Evento test",
        date: new Date("2025-05-01T00:00:00.000Z"),
      },
    });
  
    const ticket = await prisma.ticket.create({
      data: {
        owner: "Ananias",
        code: "ABC123",
        used: false,
        eventId: event.id,
      },
    });
    const { status } = await api.put(`/tickets/use/${ticket.id}`);
    expect(status).toBe(httpStatus.NO_CONTENT);
  })
})