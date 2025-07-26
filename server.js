// server.js

// 必要なライブラリをインポート
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config(); // .env ファイルを読み込む

// Expressアプリを初期化
const app = express();
const PORT = process.env.PORT || 3001;

// Supabaseクライアントを初期化
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ミドルウェアを設定
app.use(cors()); // CORSを許可
app.use(express.json()); // JSON形式のリクエストボディをパースする

// ルートURLへのアクセス確認用
app.get('/', (req, res) => {
  res.send('Hiwa Tenko Backend is running!');
});

// フロントエンドからPOSTリクエストを受け取るエンドポイント
app.post('/api/reports', async (req, res) => {
  console.log('Received data:', req.body);

  // script.jsから送られてくるデータ
  const {
    name,
    number,
    start,
    end,
    tenko,
    tenko_detail,
    tenko_name,
    alcohol_checker,
    alcohol_checker_detail,
    drunk_check,
    health_check,
    health_detail,
    daily_check,
    daily_detail,
    order_list
  } = req.body;

  // Supabaseの 'reports' テーブルにデータを挿入
  const { data, error } = await supabase
    .from('reports')
    .insert([
      {
        name,
        number,
        start: start || null, // 空文字の場合はnullを挿入
        end: end || null,     // 空文字の場合はnullを挿入
        tenko,
        tenko_detail,
        tenko_name,
        // チェックボックスは 'on' or null で来るので、booleanに変換
        alcohol_checker: alcohol_checker === 'on',
        alcohol_checker_detail,
        drunk_check: drunk_check === 'on',
        health_check: health_check === 'on',
        health_detail,
        daily_check: daily_check === 'on',
        daily_detail,
        order_list,
      },
    ])
    .select(); // 挿入したデータを返す

  if (error) {
    console.error('Supabase error:', error);
    // エラーが発生した場合は、500エラーとエラーメッセージを返す
    return res.status(500).json({ status: 'error', message: 'データベースへの保存に失敗しました。', error: error.message });
  }

  // 成功した場合は、成功ステータスとメッセージを返す
  console.log('Successfully inserted:', data);
  res.status(200).json({ status: 'success', message: '点呼データを正常に記録しました。' });
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


