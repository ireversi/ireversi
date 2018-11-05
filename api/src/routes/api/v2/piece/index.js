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
    console.log('きたよー');
    console.log(req.query);


    if (req.query.keyword !== config.deletePass) {
      res.sendStatus(204); // パスワードが違う場合
    } else {
      const pieces = PieceStore.deletePieces();
      await db.deleteMongo();
      res.json(pieces);
    }
  });
module.exports = router;
