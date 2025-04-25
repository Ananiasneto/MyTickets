import prisma from "database"
import { faker } from '@faker-js/faker';

export async function createEvent(){
     const event=await prisma.event.create({
        data:{
          name: faker.company.name(),
          date: faker.date.future().toISOString(),

        }

      })
      return event;
}
export async function createEventFactory(){
    const data={
         name: faker.company.name(),
         date: faker.date.future().toISOString(),

       }
     return data;
}



