import { describe, test, expect } from 'bun:test';
import { assessSourceConfidence } from './source-confidence.js';

describe('assessSourceConfidence', () => {
  test('gives high confidence to official Indian regulatory and exchange domains', () => {
    const report = assessSourceConfidence({
      profileId: 'india',
      workflowId: 'indian_equities',
      sourceUrls: [
        'https://www.nseindia.com/get-quotes/equity?symbol=HDFCBANK',
        'https://www.sebi.gov.in/reports-and-statistics',
      ],
    });

    expect(report.rating).toBe('high');
    expect(report.notes.join(' ')).toMatch(/official|exchange|regulator/i);
  });

  test('downgrades fragmented India property portal sources', () => {
    const report = assessSourceConfidence({
      profileId: 'india',
      workflowId: 'india_property_underwriting',
      sourceUrls: [
        'https://www.99acres.com/2-bhk-apartment-for-sale-in-whitefield-bangalore-12345',
        'https://housing.com/in/buy/projects/page/abc',
      ],
    });

    expect(report.rating).toBe('low');
    expect(report.notes.join(' ')).toMatch(/fragmented|broker|listing/i);
  });

  test('flags global structured finance APIs as limited for India-specific workflows', () => {
    const report = assessSourceConfidence({
      profileId: 'india',
      workflowId: 'indian_equities',
      sourceUrls: ['https://api.financialdatasets.ai/prices/?ticker=RELIANCE'],
    });

    expect(report.rating).toBe('medium');
    expect(report.notes.join(' ')).toMatch(/India|coverage|verify/i);
  });
});
