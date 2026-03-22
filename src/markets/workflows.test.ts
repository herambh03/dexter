import { describe, test, expect } from 'bun:test';
import { buildWorkflowGuidance, inferMarketWorkflow } from './workflows.js';

describe('inferMarketWorkflow', () => {
  test('classifies Indian listed-equity research queries', () => {
    const workflow = inferMarketWorkflow('Compare HDFC Bank and ICICI Bank valuation and loan growth for India');
    expect(workflow.id).toBe('indian_equities');
    expect(workflow.recommendedTools).toContain('get_financials');
    expect(workflow.recommendedTools).toContain('get_market_data');
  });

  test('classifies mutual fund and SIP queries', () => {
    const workflow = inferMarketWorkflow('Which Indian mutual funds are best for a SIP over 10 years?');
    expect(workflow.id).toBe('indian_mutual_funds');
    expect(workflow.caveats.join(' ')).toMatch(/AMFI|scheme/i);
  });

  test('classifies Indian REIT queries', () => {
    const workflow = inferMarketWorkflow('Compare Indian REIT yields and occupancy trends');
    expect(workflow.id).toBe('indian_reits');
  });

  test('classifies India property underwriting queries', () => {
    const workflow = inferMarketWorkflow('Underwrite a 2BHK rental apartment in Whitefield Bangalore with title risk checks');
    expect(workflow.id).toBe('india_property_underwriting');
    expect(workflow.recommendedTools).toContain('browser');
  });
});

describe('buildWorkflowGuidance', () => {
  test('returns India-specific guidance for real-estate workflows', () => {
    const guidance = buildWorkflowGuidance('Evaluate a residential property purchase in Gurgaon for rental yield', 'india');
    expect(guidance).toMatch(/title/i);
    expect(guidance).toMatch(/stamp duty/i);
    expect(guidance).toMatch(/registration/i);
  });

  test('returns India-specific guidance for investment workflows', () => {
    const guidance = buildWorkflowGuidance('Analyze NSE-listed banks for long-term investing', 'india');
    expect(guidance).toMatch(/NSE|BSE/i);
    expect(guidance).toMatch(/promoter/i);
  });
});
