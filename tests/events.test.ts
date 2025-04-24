
import prisma from "database";
import httpStatus from "http-status";
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
    it("should return an empty array ", async () => {
      const { body } = await api.get("/events");
      expect(body).toEqual([]);
      });
    
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

    it("should return a bad request if id invalid(not a number or id<0)",async()=>{
      const id="idInvalido";
        const {status }=await api.get(`/events/${id}`);
        expect(status).toBe(httpStatus.BAD_REQUEST)
    })

    it("should return a not found if event not exist",async()=>{
      const id=1;
        const {status }=await api.get(`/events/${id}`);
        expect(status).toBe(httpStatus.NOT_FOUND)
    })
})

describe("POST /events", () => {
  beforeEach(async () => {
    await prisma.event.deleteMany();
  });

  it("should create a new event", async () => {
    const data = {
      name: "Evento de Teste",
      date: new Date("2025-05-01T00:00:00.000Z"),
    };
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
    const data = {
      name: "Evento de Teste",
    };
    const { status } = await api.post("/events").send(data);
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    
  });

  it("should return a stts Conflict because duplicate names.", async () => {
    await prisma.event.create({
      data: {
      name: "Evento de Teste",
      date: new Date("2025-05-01T00:00:00.000Z"),
     },
     });
    const data = {
      name: "Evento de Teste",
      date: new Date("2025-05-03T00:00:00.000Z"),
    };
    const { status } = await api.post("/events").send(data);
    expect(status).toBe(httpStatus.CONFLICT)
  });

  it("should update event", async () => {
    const event = await prisma.event.create({
      data: {
        name: "Evento de Teste",
        date: new Date("2025-05-01T00:00:00.000Z"),
      },
    });
    const eventPut = {
      name: "Evento Atualizado",
      date: new Date("2025-06-01T00:00:00.000Z"),
    };
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
});
describe("delete /events",()=>{
  beforeEach(async () => {
    await prisma.event.deleteMany()
  });
  it("should delet event",async ()=>{
    const {id} = await prisma.event.create({
       data: {
       name: "Evento de Teste",
       date: new Date("2025-05-01T00:00:00.000Z"),
      },
      });
    
    const {status}= await api.delete(`/events/${id}`)
    expect(status).toBe(httpStatus.NO_CONTENT)
    
  })
})