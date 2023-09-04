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

//addの処理
router.get('/add', (req, res, next) => {
  var data = {
    title: 'New User',
    content: '名前とパスワードを入力して下さい。'
  }
  res.render('users/add', data);
});

//user/addの処理
router.post('/add', (req, res, next) => {
  // if (check(req, res)) {return};
  prisma.User.create({
      data:{
          name: req.body.name,
          pass: req.body.pass
      }
  }).then(() => {
      res.redirect('/boards');
  })
  .catch((err) => {
      res.redirect('/users/add');
  })
});

module.exports = router;