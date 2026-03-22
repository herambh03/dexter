export type ResearchProfileId = 'global' | 'india';

export interface ResearchProfile {
  id: ResearchProfileId;
  label: string;
  description: string;
  priorities: string[];
  investmentFocus: string[];
  realEstateFocus: string[];
  toolPolicy: string[];
}

const GLOBAL_PROFILE: ResearchProfile = {
  id: 'global',
  label: 'Global Markets',
  description: 'General-purpose investing research across listed markets with a bias toward structured fundamentals and market data.',
  priorities: [
    'Prefer structured financial data before unstructured web summaries.',
    'Be explicit about data-source limitations and geographic blind spots.',
  ],
  investmentFocus: [
    'Public equities',
    'ETFs and broad market indices',
    'Company financial statement analysis',
  ],
  realEstateFocus: [
    'REITs and listed real-estate companies',
    'High-level property market commentary when reliable sources exist',
  ],
  toolPolicy: [
    'Use get_financials and get_market_data for listed-market questions.',
    'Use web_search/web_fetch for non-structured or local market color.',
  ],
};

const INDIA_PROFILE: ResearchProfile = {
  id: 'india',
  label: 'India First',
  description:
    'India-first investing and real-estate research with explicit attention to NSE/BSE tickers, Indian mutual funds, REITs, local regulation, and property-market context.',
  priorities: [
    'Prefer India-specific interpretations over US defaults when the user is asking from an Indian context.',
    'When structured tools are weak for India, say so plainly and pivot to web or browser research.',
    'Treat the hard problem as data quality: clearly separate verified numbers from heuristics and qualitative judgments.',
  ],
  investmentFocus: [
    'NSE and BSE listed equities',
    'Indian mutual funds, SIPs, ETFs, and REITs',
    'Sector work using Indian macro, policy, and promoter-governance context',
  ],
  realEstateFocus: [
    'Residential and commercial property investing in Indian metros and tier-2 cities',
    'Rental yield, absorption, micro-market comparison, infrastructure-led appreciation, and legal/title risk',
    'Property developer, REIT, and financing analysis specific to India',
  ],
  toolPolicy: [
    'Do not assume SEC filings, US broker integrations, or US property datasets apply to India.',
    'For India public markets, prefer company names with NSE/BSE identifiers when available and call out if data is stale or symbol mapping is uncertain.',
    'For India real estate, rely more heavily on browser/web research and explicitly mention when a claim depends on fragmented local-market sources.',
    'When giving recommendations, include caveats about state-level regulation, stamp duty, registration, title diligence, and financing assumptions where relevant.',
  ],
};

const PROFILE_MAP: Record<ResearchProfileId, ResearchProfile> = {
  global: GLOBAL_PROFILE,
  india: INDIA_PROFILE,
};

export function getResearchProfile(profileId?: string | null): ResearchProfile {
  if (!profileId) {
    return INDIA_PROFILE;
  }

  const normalized = profileId.trim().toLowerCase();
  if (normalized === 'india' || normalized === 'in' || normalized === 'india-first') {
    return INDIA_PROFILE;
  }

  return GLOBAL_PROFILE;
}

export function buildResearchProfileSection(profile: ResearchProfile): string {
  const renderBullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

  return `## Research Profile\n\nProfile: ${profile.label}\n\n${profile.description}\n\n### Priorities\n${renderBullets(profile.priorities)}\n\n### Investment Focus\n${renderBullets(profile.investmentFocus)}\n\n### Real Estate Focus\n${renderBullets(profile.realEstateFocus)}\n\n### Tool Policy Overrides\n${renderBullets(profile.toolPolicy)}`;
}
