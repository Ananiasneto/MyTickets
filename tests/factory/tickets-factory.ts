
import { faker } from '@faker-js/faker';
import prisma from 'database';

export async function createTicket(eventId: number) {
  const ticket = await prisma.ticket.create({
    data: {
      owner: faker.person.fullName(),
      code: faker.string.uuid(),
      eventId, 
    },
  });
  return ticket;
}

export async function createTicketFactory(eventId) {
    const ticket = {
        owner: faker.person.fullName(),
        code: faker.string.uuid(),
        eventId, 
      }
    return ticket;
  }
