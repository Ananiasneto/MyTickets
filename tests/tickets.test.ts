import prisma from "database";
import httpStatus from "http-status";
import app from "index";
import supertest from "supertest";
import { createEvent } from "./factory/event-factory";
import { createTicket, createTicketFactory, usaTicket } from "./factory/tickets-factory";
 
const api=supertest(app);

describe("GET /tickets",()=>{
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
  it("should return stts because id invalid",async()=>{
    const id="idInvalido";
      const {status}=await api.get(`/tickets/${id}`);
      expect(status).toBe(httpStatus.BAD_REQUEST);
  })
  it("should return empyt array because no ticket exist",async()=>{
    const event=await createEvent();
    const {body}=await api.get(`/tickets/${event.id}`);
    expect(body).toEqual([]);
  })

  
})
    
  describe("POST /tickets",()=>{
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
  it("should return uniprocessable entity because schema invalid",async()=>{
    const {id} = await createEvent();
    const {owner,code}=await createTicketFactory(id);
    const {status }=await api.post(`/tickets`).send(
      {owner,code});
  
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
})
it("should return Not Found if event with this id not exist",async()=>{
  const id=999999;
  const {owner,code}=await createTicketFactory(id);
  const {status }=await api.post(`/tickets`).send(
    {owner,code,eventId:id});

  expect(status).toBe(httpStatus.NOT_FOUND);
})

it("should return conflict if ticket with code exists for event", async () => {
  const event = await createEvent();
  const ticket1=await createTicket(event.id);
  const ticket2={owner:ticket1.owner,code:ticket1.code,eventId:event.id};
  const { status} = await api.post("/tickets").send(ticket2);

  expect(status).toBe(httpStatus.CONFLICT);
});

  
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

  it("should return bad request because id invalid", async () => {
    const id="idInvalido";
    const { status } = await api.put(`/tickets/use/${id}`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  })
  it("should return Not Found if event with this id not exist",async()=>{
    const id=999999;
    const { status } = await api.put(`/tickets/use/${id}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  })
  
  
it("should return forbidden if ticket used", async () => {
  const event = await createEvent();
  const ticket=await createTicket(event.id);
  await usaTicket(ticket.id)
const { status } = await api.put(`/tickets/use/${ticket.id}`);

  expect(status).toBe(httpStatus.FORBIDDEN);
});
  })