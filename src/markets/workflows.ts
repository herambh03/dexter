import type { ResearchProfileId } from './profiles.js';

export type MarketWorkflowId =
  | 'indian_equities'
  | 'indian_mutual_funds'
  | 'indian_reits'
  | 'india_real_estate_market'
  | 'india_property_underwriting'
  | 'general_research';

export interface MarketWorkflow {
  id: MarketWorkflowId;
  label: string;
  recommendedTools: string[];
  caveats: string[];
}

function includesAny(query: string, terms: readonly string[]): boolean {
  return terms.some((term) => query.includes(term));
}

export function inferMarketWorkflow(rawQuery: string): MarketWorkflow {
  const query = rawQuery.toLowerCase();

  const realEstateTerms = [
    'real estate', 'property', 'apartment', 'flat', 'villa', 'plot', 'rental yield', 'lease', 'micro-market',
    'underwrite', 'underwriting', 'title risk', 'stamp duty', 'registration', 'locality', 'builder', 'developer',
  ];
  const mutualFundTerms = ['mutual fund', 'sip', 'amfi', 'nav', 'small cap fund', 'index fund', 'elss'];
  const reitTerms = ['reit', 'reits'];

  if (includesAny(query, realEstateTerms)) {
    const underwritingTerms = ['underwrite', 'underwriting', 'rental yield', 'title risk', 'stamp duty', 'registration', 'cash flow'];
    if (includesAny(query, underwritingTerms)) {
      return {
        id: 'india_property_underwriting',
        label: 'India Property Underwriting',
        recommendedTools: ['browser', 'web_search', 'web_fetch'],
        caveats: [
          'Use locality-specific comparables, not generic national averages.',
          'Highlight title diligence, RERA status, stamp duty, registration, and financing assumptions.',
        ],
      };
    }

    return {
      id: 'india_real_estate_market',
      label: 'India Real Estate Market Research',
      recommendedTools: ['browser', 'web_search', 'web_fetch'],
      caveats: [
        'Local property data is fragmented and often broker-led.',
        'Separate anecdotal listing data from verified developer, regulator, or government sources.',
      ],
    };
  }

  if (includesAny(query, reitTerms)) {
    return {
      id: 'indian_reits',
      label: 'Indian REIT Research',
      recommendedTools: ['get_financials', 'get_market_data', 'web_search'],
      caveats: [
        'Check occupancy, lease expiry profile, sponsor quality, and distribution sustainability.',
        'For India, supplement structured data with exchange filings and management commentary.',
      ],
    };
  }

  if (includesAny(query, mutualFundTerms)) {
    return {
      id: 'indian_mutual_funds',
      label: 'Indian Mutual Fund Research',
      recommendedTools: ['web_search', 'web_fetch', 'browser'],
      caveats: [
        'Cross-check with AMFI and scheme factsheets before making conclusions.',
        'Distinguish category averages, benchmark returns, and actual scheme strategy changes.',
      ],
    };
  }

  const indianEquityTerms = ['nse', 'bse', 'india', 'indian stocks', 'promoter', 'sebi', 'bank nifty', 'nifty'];
  if (includesAny(query, indianEquityTerms)) {
    return {
      id: 'indian_equities',
      label: 'Indian Equity Research',
      recommendedTools: ['get_financials', 'get_market_data', 'web_search'],
      caveats: [
        'Call out symbol-mapping uncertainty when Indian listings are not cleanly resolved.',
        'In India, promoter holding, pledging, and governance context matter alongside financials.',
      ],
    };
  }

  return {
    id: 'general_research',
    label: 'General Research',
    recommendedTools: ['web_search', 'web_fetch'],
    caveats: ['Be explicit when the answer depends on incomplete or non-local data.'],
  };
}

export function buildWorkflowGuidance(rawQuery: string, profileId: ResearchProfileId = 'india'): string {
  const workflow = inferMarketWorkflow(rawQuery);
  const profileLabel = profileId === 'india' ? 'India-first' : 'Global';

  const workflowSpecific = {
    indian_equities: [
      'Prefer NSE/BSE framing over US defaults when naming listed companies.',
      'Discuss promoter holdings, pledging, capital allocation, and regulatory context where relevant.',
    ],
    indian_mutual_funds: [
      'Use AMFI and scheme factsheets as the preferred verification path.',
      'Separate SIP suitability from backward-looking return chasing.',
    ],
    indian_reits: [
      'Anchor analysis in occupancy, rental escalations, sponsor quality, debt, and distributions.',
      'Use listed-market data plus India filing/browser verification for context.',
    ],
    india_real_estate_market: [
      'Treat listing portals and broker commentary as directional, not definitive.',
      'Mention city, micro-market, infrastructure, supply pipeline, and regulatory differences.',
    ],
    india_property_underwriting: [
      'Always mention title checks, encumbrance risk, stamp duty, registration, and financing assumptions.',
      'Prefer localized rental comps and cash-flow assumptions over broad heuristics.',
    ],
    general_research: ['State clearly when local Indian applicability is weak or uncertain.'],
  } satisfies Record<MarketWorkflowId, string[]>;

  const lines = [
    `Workflow: ${workflow.label}`,
    `Profile: ${profileLabel}`,
    `Recommended tools: ${workflow.recommendedTools.join(', ')}`,
    ...workflow.caveats,
    ...workflowSpecific[workflow.id],
  ];

  return lines.map((line) => `- ${line}`).join('\n');
}
