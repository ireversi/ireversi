const calcCandidate = require('../../routes/v1/board/calcCandidate.js');

function convertComparisonResult(result) {
  const pieces = [];
  const size = Math.sqrt(result.length);
  for (let i = 0; i < result.length; i += 1) {
    if (result[i] !== 0) {
      const piece = {
        x: Math.floor(i % size),
        y: Math.floor(i / size),
        userId: result[i],
      };
      pieces.push(piece);
    }
  }
  return pieces;
}

function convertCandidateList(result) {
  const pieces = [];
  const size = Math.sqrt(result.length);
  for (let i = 0; i < result.length; i += 1) {
    if (result[i] !== 0) {
      const piece = {
        x: Math.floor(i % size),
        y: Math.floor(i / size),
      };
      pieces.push(piece);
    }
  }
  return pieces;
}

describe('calcCandidate', () => {
  // beforeAll(prepareDB);
  // afterEach(deleteAllDataFromDB);

  // 一つ駒を置く
  it('calcs candidates for first piece', async () => {
    // Given
    const userId = 10;

    // prettier-ignore
    const testCase = convertComparisonResult(
      [
        0, 0, 0, 0,
        0, 1, 2, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ],
    );

    // prettier-ignore
    const matchers = convertCandidateList(
      [
        0, userId, userId, 0,
        userId, 0, 0, userId,
        0, userId, userId, 0,
        0, 0, 0, 0,
      ],
    );

    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    const response = calcCandidate.calc(userId, testCase);
    // Then
    expect(response).toHaveLength(matchers.length);
    expect(response).toEqual(expect.arrayContaining(matchers));
  });
});

describe('calcCandidate', () => {
  // beforeAll(prepareDB);
  // afterEach(deleteAllDataFromDB);

  // 一つ駒を置く
  it('calcs candidates for first piece', async () => {
    // Given
    const userId = 10;

    // prettier-ignore
    const testCase = convertComparisonResult(
      [
        0, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ],
    );

    // prettier-ignore
    const matchers = convertCandidateList(
      [
        0, userId, 0, 0,
        userId, 0, userId, 0,
        0, userId, 0, 0,
        0, 0, 0, 0,
      ],
    );

    // When
    const response = calcCandidate.calc(userId, testCase);
    // Then
    expect(response).toHaveLength(matchers.length);
    expect(response).toEqual(expect.arrayContaining(matchers));
  });
});

describe('calcCandidate', () => {
  it('calcs candidates for more than two pieces', async () => {
    // Given
    const userId = 2;

    // prettier-ignore
    const testCase = convertComparisonResult(
      [
        0, 0, 0, 0,
        0, 1, 2, 0,
        0, 3, 2, 0,
        0, 0, 0, 0,
      ],
    );

    // prettier-ignore
    const matchers = convertCandidateList(
      [
        userId, 0, 0, 0,
        userId, 0, 0, 0,
        userId, 0, 0, 0,
        userId, 0, 0, 0,
      ],
    );

    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    const response = calcCandidate.calc(userId, testCase);
    // Then
    expect(response).toHaveLength(matchers.length);
    expect(response).toEqual(expect.arrayContaining(matchers));
  });
});

describe('calcCandidate', () => {
  it('calcs candidates to resolve Ando-san issue', async () => {
    // Given
    const userId = 2;

    // prettier-ignore
    const testCase = convertComparisonResult(
      [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 2, 0,
        0, 1, 1, 1, 2, 0, 0,
        0, 0, 0, 2, 3, 0, 0,
        0, 0, 0, 0, 2, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
    );

    // prettier-ignore
    const matchers = convertCandidateList(
      [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, userId, 0, userId, 0, 0, 0,
        userId, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, userId, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
    );

    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    const response = calcCandidate.calc(userId, testCase);
    // Then
    expect(response).toHaveLength(matchers.length);
    expect(response).toEqual(expect.arrayContaining(matchers));
  });
});
