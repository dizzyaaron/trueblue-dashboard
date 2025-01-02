import { faker } from '@faker-js/faker';

export const generateRandomCustomer = () => ({
  id: `c${Date.now()}`,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number('(###) ###-####'),
  address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}`,
  notes: faker.lorem.sentence(),
  createdAt: new Date().toISOString()
});

export const generateRandomJob = (customerId: string, customerAddress: string) => {
  const jobTypes = ['Repair', 'Installation', 'Maintenance', 'Renovation', 'Inspection'];
  const areas = ['Kitchen', 'Bathroom', 'Basement', 'Roof', 'Garage', 'Living Room'];
  const services = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting'];
  
  const title = `${faker.helpers.arrayElement(services)} ${faker.helpers.arrayElement(jobTypes)} - ${faker.helpers.arrayElement(areas)}`;
  
  return {
    id: `j${Date.now()}`,
    customerId,
    title,
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed'] as const),
    scheduledDate: faker.date.future().toISOString().split('T')[0],
    location: customerAddress,
    price: faker.number.int({ min: 500, max: 5000 }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};