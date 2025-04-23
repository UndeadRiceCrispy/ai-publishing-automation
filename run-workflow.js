import { runGraphWorkflow } from '../../lib/workflow';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_goal } = req.body;

  try {
    const result = await runGraphWorkflow({ user_goal });
    res.status(200).json(result);
  } catch (error) {
    console.error('Workflow error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}