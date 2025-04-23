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
