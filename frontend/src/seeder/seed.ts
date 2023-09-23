import { faker } from "@faker-js/faker";

const users = [...Array(10)].map(() => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
}));
