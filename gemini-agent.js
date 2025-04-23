const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiAgent {
  constructor(role) {
    this.role = role;
  }

  async run(inputData) {
    const prompt = this.buildPrompt(inputData);
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return { [this.role]: text };
  }

  buildPrompt(data) {
    switch (this.role) {
      case 'topic_generator':
        return `Generate 3 blog topic ideas around these keywords: ${data.keywords?.join(', ')}`;
      case 'content_writer':
        return `Write a full blog post on this topic: ${data.topics?.[0]}`;
      case 'editor':
        return `Edit this blog draft for grammar, tone, and clarity:

${data.draft}`;
      case 'seo_optimizer':
        return `Optimize the following content for SEO:

${data.edited}`;
      case 'approver':
        return `Does this content meet brand tone and quality? Approve or suggest revisions:

${data.optimized}`;
      case 'publisher':
        return `Format and prepare this content for ${data.platform}:

${data.optimized}`;
      case 'social_promoter':
        return `Create 3 promotional social media posts for this content.`;
      case 'analytics_reviewer':
        return `Generate performance analysis and suggestions for improvement on the following post:`;
      case 'triage_router':
        return `Given this goal: ${data.user_goal}, route the request to the appropriate agent.`;
      default:
        return `Respond to the following input: ${JSON.stringify(data)}`;
    }
  }
}