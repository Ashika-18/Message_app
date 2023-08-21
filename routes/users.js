const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET users listing. */
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力して下さい。'
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  prisma.User.findMany({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    }
  }).then(usr => {
    if (usr != null && usr[0] != null) {
      req.session.login = usr[0];
      let back = req.session.back;
      if (back == null) {
        back = '/';
      }
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力して下さい！'
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;