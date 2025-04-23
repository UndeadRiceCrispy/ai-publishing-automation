import { GeminiAgent } from './gemini-agent';

export async function runGraphWorkflow(input) {
  const steps = [];

  const triage = new GeminiAgent('triage_router');
  const { next_node } = await triage.run(input);
  steps.push({ step: 'TriageNode', result: next_node });

  const topic = new GeminiAgent('topic_generator');
  const topicOutput = await topic.run(input);
  steps.push({ step: 'TopicAgent', result: topicOutput });

  const writer = new GeminiAgent('content_writer');
  const draft = await writer.run(topicOutput);
  steps.push({ step: 'WriterAgent', result: draft });

  const editor = new GeminiAgent('editor');
  const edited = await editor.run(draft);
  steps.push({ step: 'EditorAgent', result: edited });

  const seo = new GeminiAgent('seo_optimizer');
  const seoResult = await seo.run(edited);
  steps.push({ step: 'SEOAgent', result: seoResult });

  const approver = new GeminiAgent('approver');
  const approval = await approver.run(seoResult);
  steps.push({ step: 'ApprovalAgent', result: approval });

  const publisher = new GeminiAgent('publisher');
  const published = await publisher.run({ ...approval, platform: input.platform });
  steps.push({ step: 'PublishAgent', result: published });

  const social = new GeminiAgent('social_promoter');
  const socialPosts = await social.run(published);
  steps.push({ step: 'SocialAgent', result: socialPosts });

  const analytics = new GeminiAgent('analytics_reviewer');
  const feedback = await analytics.run(published);
  steps.push({ step: 'AnalyticsAgent', result: feedback });

  return { completed: true, steps };
}