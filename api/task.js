import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, account_id } = req.body || {};

    if (!type || !account_id) {
      return res.status(400).json({ error: '缺少參數' });
    }

    const sql = neon(process.env.NEON_CONNECTION);
    
    const result = await sql`
      INSERT INTO tasks (type, account_id, status) 
      VALUES (${type}, ${account_id}, 'pending') 
      RETURNING id
    `;

    return res.status(200).json({
      success: true,
      task_id: result[0].id,
      message: '任務已加入佇列'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
