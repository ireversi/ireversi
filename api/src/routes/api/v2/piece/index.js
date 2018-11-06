const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../../../../config.js');

const PieceStore = require('../../../../models/v2/PieceStore.js');
const db = require('../../../../utils/db.js');

router.route('/')
  .post((req, res) => {
    const jwtId = req.headers.authorization;
    const { userId } = jwt.decode(jwtId);
    const piece = {
      x: +req.body.x,
      y: +req.body.y,
      userId,
    };

    const status = PieceStore.judgePiece(piece.x, piece.y, piece.userId);
    res.json({ status, piece });
  })
  .delete(async (req, res) => {
    if (req.query.keyword !== config.deletePass) {
      res.sendStatus(204); // パスワードが違う場合
    } else {
      Promise.all([PieceStore.deletePieces(), db.deleteMongo()]);
      res.sendStatus(204);
    }
  });
module.exports = router;
