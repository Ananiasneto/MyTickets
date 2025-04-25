import prisma from "database";
import httpStatus from "http-status";
import app from "index";
import supertest from "supertest";
import { createEvent } from "./factory/event-factory";
import { createTicket, createTicketFactory } from "./factory/tickets-factory";
 
const api=supertest(app);

describe("get /tickets",()=>{
  beforeEach(async () => {
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
  });
    it("should return all tickets by eventId",async()=>{
        const event=await createEvent();
        await createTicket(event.id);

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
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
  });
      
    it("should create ticket and return stts 201 and ticket",async()=>{
      const {id} = await createEvent();
      const {owner,code,eventId}=await createTicketFactory(id);
      const {body,status }=await api.post(`/tickets`).send(
        {owner,code,eventId});
    
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
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
  });
  it("should update ticket by id and return status 204", async () => {
    const event = await createEvent();
    const ticket =   await createTicket(event.id);
    const { status } = await api.put(`/tickets/use/${ticket.id}`);
    expect(status).toBe(httpStatus.NO_CONTENT);
  })
})