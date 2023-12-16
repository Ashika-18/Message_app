const express = require('express');
const router = express.Router();

//validator
const { check, validationResult } = require('express-validator');

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET users listing. */
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力して下さい!'
  }
  console.log('名前とパス😎');
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
        back = '/boards', data;
      }
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力して下さい！'
      }
      console.log('errorやな😝');
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

//user_addの処理
router.post('/add', [ 
  check('name', 'NAME は必ず入力して下さい').notEmpty().escape(),
  check('pass', 'PASSは必ず入力して下さい').notEmpty().escape()
], (req, res, next) => {
  const errors = validationResult(req);

      if (!errors.isEmpty()) {
        var result = '<ul class="text-danger">';
        var result_arr = errors.array();
        for(var n in result_arr) {
          result += '<li>' + result_arr[n].msg + '</li>'
        }
        result += '</ul>';
        var data = {
          title: 'error',
          content: result,
          form: req.body
        }; res.render('users/add', data);

      } else {
  prisma.User.create({
      data:{
          name: req.body.name,
          pass: req.body.pass
      }
  }).then(() => {
      res.redirect('/users/login');
  })
  .catch((err) => {
      res.redirect('/users/add');
  })}
});

module.exports = router;