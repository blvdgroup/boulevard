// TODO: currently a sample test file. Try out some blvd-specific test cases?

beforeAll(() => {
  // This will run before each test.
})

afterAll(() => {
  // This will run after each tests are completed.
})

describe('sample test suite', () => {
  test('Array.indexOf() returns -1 for out of bounds indexes', () => {
    expect([0, 1, 2, 3].indexOf(4)).toBe(-1)
  })
})
