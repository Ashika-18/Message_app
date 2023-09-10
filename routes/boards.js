const express = require('express');
const router = express.Router();

//validator
const { check, validationResult } = require('express-validator');

const ps = require('@prisma/client');
const { name } = require('../app');
const prisma = new ps.PrismaClient();

const pnum = 5; //1ページ当たりの表示数

//ログインのチェック
const check_login = (req,res) => {
    if (req.session.login == null) {
        req.session.back = '/boards';
        res.redirect('/users/login');
        console.log('ログインしていない😱');
        return true;
    } else {
        console.log('ログイン出来てる!😍');
        return false;
    }
}

//メッセージとIDのチェック
const msg_check = (req, res) => {
    if (accountId == id ) {
        return true;
    } else {
        return false;
    }
}

//トップページ
router.get('/', (req, res, next) => {
    res.redirect('/boards/0');
    console.log('-TOPページです!-')
});

//トップページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check_login(req, res)) { return };
    const pg = +req.params.page;
    prisma.Board.findMany({
        skip: pg > 0 ? (pg - 1) * pnum : 0,
        take: pnum,
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        var data = {
        title: 'Boards',
        login: req.session.login,
        content: brds,
        page: pg
        }
        res.render('boards/index', data);
    });
});

//メッセージフォームの送信処理
router.post('/add', [
    check('msg', 'メッセージは必ず入力して下さい。').notEmpty().escape()
],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var result = '<ul class="text-danger">';
        var result_arr = errors.array();
        for (var n in result_arr) {
            result += '<li>' + result_arr[n].msg + '</li>'
        }
        result += '</ul>';
        var data = {
            title: 'Boards',
            content: result,
            form: req.body
        };
        res.render('users/login', data);
    } else {
        if (check_login(req, res)) {return};
    prisma.Board.create({
        data:{
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards/0');
    })
    .catch((err) => {
        console.error("エラーが発生しました:", err);
    var data = {
        title: 'Boards',
        content: 'エラーが発生しました。もう一度試してください。',
        form: req.body
    };
        res.redirect('/users/login');
    })
    }
});

//メッセージの編集
router.post('/edit/:user/:id/:page', (req, res, next) => {
    if (check_login (req, res)) {return};
    const id = +req.params.id;
    const pg = +req.params.page;
    
    prisma.Board.findMany({
        where: {accountId: id},
        skip: pg * pnum,
        take: pnum, 
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: '編集ページ',
            login: req.session.login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('boards/edit', data);
    });
});

//利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    if (check_login (req, res)) {return};
    const id = +req.params.id;
    const pg = +req.params.page;
    
    prisma.Board.findMany({
        where: {accountId: id},
        skip: pg * pnum,
        take: pnum, 
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: 'Boards',
            login: req.session.login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('boards/home', data);
    });
});

console.log('最後まで読み込みOK!');

module.exports = router;