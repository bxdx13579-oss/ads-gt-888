import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.NEON_CONNECTION,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, account_id } = req.body;

  if (!type || !account_id) {
    return res.status(400).json({ error: '缺少 type 或 account_id' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO tasks (type, account_id) VALUES ($1, $2) RETURNING id',
      [type, account_id]
    );
    client.release();

    res.status(200).json({
      success: true,
      task_id: result.rows[0].id,
      message: '任務已加入'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '資料庫錯誤', detail: error.message });
  }
}
