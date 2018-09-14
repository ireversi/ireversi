const { setup, teardown } = require('./build.js');

jest.setTimeout(jestTimeout);
let nuxt;

beforeAll(async () => {
  nuxt = await setup();
});
afterAll(async () => {
  await teardown(nuxt);
});

test('Build Nuxt', async () => {
  expect(0).toBe(0);
});
