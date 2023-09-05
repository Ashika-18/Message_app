const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

const pnum = 5; //1ページ当たりの表示数

//ログインのチェック
const check = (req,res) => {
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

//トップページ
router.get('/', (req, res, next) => {
    res.redirect('/boards/0');
    console.log('-TOPページです!-')
});

//トップページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const pg = +req.params.page;
    prisma.Board.findMany({
        skip: pg * pnum,
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
router.post('/add', (req, res, next) => {
    if (check(req, res)) {return};
    prisma.Board.create({
        data:{
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards');
    })
    .catch((err) => {
        res.redirect('/boards/add');
    })
});

//メッセージの編集
router.post('/add', (req, res, next) => {
    if (check(req, res)) {return};
    prisma.Board.update({
        data:{
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards');
    })
    .catch((err) => {
        res.redirect('/boards/add');
    })
});

//利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    if (check (req, res)) {return};
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