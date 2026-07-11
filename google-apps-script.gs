/**
 * 1週間英語ラボ → Googleスプレッドシート 自動同期
 * ------------------------------------------------------------
 * 使い方（全部無料・5分）:
 *  1. 同期先にしたいGoogleスプレッドシートを新規作成して開く
 *  2. 拡張機能 → Apps Script を開く
 *  3. このファイルの中身を全部コピペして貼り付け、保存
 *  4. 右上「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *       - 次のユーザーとして実行: 自分
 *       - アクセスできるユーザー: 全員
 *     →「デプロイ」して表示される「ウェブアプリのURL」(.../exec) をコピー
 *  5. アプリの ⚙️設定 →「GAS Web App URL」に貼り付けて保存
 *  6.「📤 スプシへ同期」を押すと、各テーブルがシートのタブに書き出されます
 *
 * ※アプリはブラウザから no-cors で送信するため、成功可否はスプシ側で確認してください。
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tables = {
      'チャレンジ_結果': data.challenges,
      '学習法': data.methods,
      '発信者': data.influencers,
      '毎日記録': data.logs,
      'テスト': data.tests,
      '週次レビュー': data.reviews
    };
    Object.keys(tables).forEach(function(name) {
      writeTable(ss, name, tables[name] || []);
    });
    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeTable(ss, name, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  if (!rows.length) { sheet.getRange(1, 1).setValue('(データなし)'); return; }
  // 全行のキーを集約してヘッダーに
  var keys = [];
  rows.forEach(function(r) {
    Object.keys(r).forEach(function(k) { if (keys.indexOf(k) < 0) keys.push(k); });
  });
  var values = [keys];
  rows.forEach(function(r) {
    values.push(keys.map(function(k) {
      var v = r[k];
      return (v === null || v === undefined) ? '' : (typeof v === 'object' ? JSON.stringify(v) : v);
    }));
  });
  sheet.getRange(1, 1, values.length, keys.length).setValues(values);
  sheet.getRange(1, 1, 1, keys.length).setFontWeight('bold').setBackground('#173c39').setFontColor('#4dd0c3');
  sheet.setFrozenRows(1);
}

// 動作テスト用（Apps Scriptエディタから実行して確認できます）
function testWrite() {
  writeTable(SpreadsheetApp.getActiveSpreadsheet(), 'テスト書込', [{a:1,b:'あ'},{a:2,b:'い'}]);
}
