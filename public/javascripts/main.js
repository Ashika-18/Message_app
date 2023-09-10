// メッセージの削除ボタンがクリックされたときに呼び出される関数
function deleteMessage(messageId) {
    // ユーザーに確認を求めるアラートを表示
    if (confirm('このメッセージを削除しますか？')) {
        // 確認が得られた場合、サーバーに削除リクエストを送信
        fetch(`/boards/delete/${messageId}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // メッセージの削除が成功した場合、ページをリロードするか、メッセージを非表示にするなどの操作を行う
                // ここでの操作はアプリケーションの要件に合わせて行ってください。
                alert('メッセージが削除されました');
                window.location.reload(); // ページをリロードする例
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

console.log('JavaScript読み込みOK👁️');