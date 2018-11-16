const PieceStore = require('../models/v2/PieceStore.js');

module.exports = {
  array2PieceMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
      userId: p,
    } : p))).filter(p => p !== 0);
  },

  array2CandidateMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
    } : p))).filter(p => p !== 0);
  },

  setTesPieces(pieces) {
    const size = Math.sqrt(pieces.length);
    pieces.forEach((p, idx) => {
      if (p !== 0) {
        PieceStore.addPiece({
          x: Math.floor(idx % size) - Math.floor(size / 2),
          y: Math.floor(idx / size) - Math.floor(size / 2),
          userId: p,
        });
      }
    });
  },
};
