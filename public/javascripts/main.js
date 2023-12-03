//prevを0以下に表示させない
const http = require('http');
const fs = require('fs');
const ejs = require('ejs'); // テンプレートエンジンを使用

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/boards') {
    // 仮のページ数（実際にはデータベースから取得するなどの方法で取得）
    const page = 0; // ここを実際のページ数に置き換える

    // ページ番号が0以下の場合はPrevリンクを非表示にする
    const showPrevLink = page > 0;

    // テンプレートを読み込み、データを埋め込んでHTMLを生成
    fs.readFile('template.html', 'utf8', (err, template) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }

      const renderedHTML = ejs.render(template, { showPrevLink });

      res.setHeader('Content-Type', 'text/html');
      res.end(renderedHTML);
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// メッセージの削除ボタンがクリックされたときに呼び出される関数
function deleteMessage(messageId, event) {
    // ユーザーに確認を求めるアラートを表示
    if (confirm('このメッセージを削除しますか？')) {
        // クリックイベントをキャンセル
        event.preventDefault();
        // 確認が得られた場合、サーバーに削除リクエストを送信
        fetch(`/boards/delete/${messageId}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('メッセージが削除されました');
                window.location.reload(); // ページをリロードする
            } else {
                alert('メッセージの削除に失敗しました');
            }
        })
        .catch(error => {
            console.error('削除エラー:', error);
            alert('エラーが発生しました');
        });
    }
}

function confirmDelete(messageId) {
    var result = confirm('このメッセージを削除しますか？');
    if (result) {
        return true; // フォームの送信を許可
    } else {
        return false; // フォームの送信をキャンセル
    }
}

