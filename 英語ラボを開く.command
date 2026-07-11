#!/bin/bash
# ダブルクリックで「1週間英語ラボ」をローカルサーバー経由でブラウザに開きます。
# （file:// で直接開くとデータ保存が効かない場合があるため、これが確実です）
cd "$(dirname "$0")"
PORT=8731
# 既存の同ポートサーバーがあれば流用、なければ起動
if ! curl -s -o /dev/null "http://localhost:$PORT/index.html"; then
  python3 -m http.server "$PORT" >/tmp/eigolab_server.log 2>&1 &
  sleep 1
fi
open "http://localhost:$PORT/index.html"
echo ""
echo "  1週間英語ラボを起動しました → http://localhost:$PORT/index.html"
echo "  このウィンドウを閉じるとサーバーも止まります。開いたまま使ってください。"
echo ""
# サーバーをこのウィンドウで保持（閉じると停止）
wait
