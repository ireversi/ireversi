const mongoose = require('mongoose');
const ExampleModel = require('../src/models/ExampleModel.js');

const propFilter = '-_id -__v';

describe('Example of Jest using Mongoose', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(
      global.__MONGO_URI__,
      { dbName: global.__MONGO_DB_NAME__ },
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Evaluate the inserted document', async () => {
    // Given
    const name = 'example';

    // When
    await new ExampleModel({ name }).save();

    // Then
    const result = await ExampleModel.findOne({}, propFilter).lean();
    expect(result.name).toMatch(name);
  });
});
