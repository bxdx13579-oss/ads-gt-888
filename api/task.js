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
      return res.status(400).json({ error: '缺少 type 或 account_id' });
    }

    // 暫時先回傳成功，確認 API 可通
    return res.status(200).json({
      success: true,
      message: '收到任務',
      type,
      account_id
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
