
import httpStatus from "http-status";
import app from "index";
import supertest from "supertest";
import { createEvent, createEventFactory } from "./factory/event-factory";
import prisma from "database";


 
const api=supertest(app);
describe("get /events",()=>{

  beforeEach(async () => {
    await prisma.event.deleteMany()
  });

    it("should return an array of events",async()=>{
      await createEvent();
        const {body }=await api.get("/events");
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              date: expect.any(String), 
            }),
          ]));
        })
    it("should return an empty array ", async () => {
      const { body } = await api.get("/events");
      expect(body).toEqual([]);
      });
    
    it("should return an especific event",async()=>{
      const {id}=await createEvent();
        const {body }=await api.get(`/events/${id}`);
        expect(body).toEqual(
            expect.objectContaining({
              id: id,
              name: expect.any(String),
              date: expect.any(String), 
            }),
          );
    })

    it("should return a bad request if id invalid(not a number or id<0)",async()=>{
      const id="idInvalido";
        const {status }=await api.get(`/events/${id}`);
        expect(status).toBe(httpStatus.BAD_REQUEST)
    })

    it("should return a not found if event not exist",async()=>{
      const id=999999;
        const {status }=await api.get(`/events/${id}`);
        expect(status).toBe(httpStatus.NOT_FOUND)
    })
})

describe("POST /events", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany();
  });

  it("should create a new event", async () => {
   const data = await createEventFactory();
    const { status, body } = await api.post("/events").send(data);
    expect(status).toBe(httpStatus.CREATED)
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: data.name,
        date: expect.any(String),
      })
    );
  });
  it("should return a stts Unprocessable entity because invalid schema", async () => {
    const {name} = await createEvent();
    const { status } = await api.post("/events").send(name);
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    
  });

  it("should return a stts Conflict because duplicate names.", async () => {
    const {name,date} = await createEvent();
    const { status } = await api.post("/events").send({
      name: name,
      date: new Date(date).toISOString()
    });
  
    expect(status).toBe(httpStatus.CONFLICT)
  });


});
describe("PUT /events", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany();
  });
  it("should update event", async () => {
    const event = await createEvent();
    const eventPut =await createEventFactory();
    const { status, body } = await api.put(`/events/${event.id}`).send(eventPut);

    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.objectContaining({
        id: event.id,
        name: eventPut.name,
        date: expect.any(String),
      })
    );
  });
  it("should return a stts Unprocessable entity because invalid schema", async () => {
    const event = await createEvent();
    const eventPut =await createEventFactory();
    const { status } = await api.put(`/events/${event.id}`).send(eventPut.name);
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    
  });

  it("should return a bad request if id invalid(not a number or id<0)",async()=>{
    const id="idInvalido";
    const eventPut =await createEventFactory();
      const {status }=await api.put(`/events/${id}`).send(eventPut);
      expect(status).toBe(httpStatus.BAD_REQUEST)
  })
  it("should return a not found if event not exist",async()=>{
    const id=999999;
    const eventPut =await createEventFactory();
      const {status }=await api.put(`/events/${id}`).send(eventPut);
      expect(status).toBe(httpStatus.NOT_FOUND)
  })
  it("should return a conflict if exist equal names",async()=>{
    const event = await createEvent();
    const eventPut = await createEvent();
    const data={name:eventPut.name,date:event.date}
      const {status }=await api.put(`/events/${event.id}`).send(data);
      expect(status).toBe(httpStatus.CONFLICT)
  })



});
describe("delete /events",()=>{
  beforeEach(async () => {
    await prisma.event.deleteMany()
  });
  it("should delet event",async ()=>{
    const {id} = await createEvent();
    
    const {status}= await api.delete(`/events/${id}`)
    expect(status).toBe(httpStatus.NO_CONTENT)
    
  })

  it("should return a bad request if id invalid(not a number or id<0)",async()=>{
    const id="idInvalido";
      const {status }=await api.delete(`/events/${id}`);
      expect(status).toBe(httpStatus.BAD_REQUEST)
  })
  it("should return a not found if event not exist",async()=>{
    const id=999999;
      const {status }=await api.delete(`/events/${id}`);
      expect(status).toBe(httpStatus.NOT_FOUND)
  })
})