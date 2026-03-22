import type { ResearchProfileId } from './profiles.js';
import type { MarketWorkflowId } from './workflows.js';

export type SourceConfidenceRating = 'high' | 'medium' | 'low';

export interface SourceConfidenceReport {
  rating: SourceConfidenceRating;
  notes: string[];
}

export interface AssessSourceConfidenceInput {
  profileId: ResearchProfileId;
  workflowId: MarketWorkflowId;
  sourceUrls: string[];
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isOfficialIndianSource(hostname: string): boolean {
  return [
    'nseindia.com',
    'www.nseindia.com',
    'bseindia.com',
    'www.bseindia.com',
    'sebi.gov.in',
    'www.sebi.gov.in',
    'rbi.org.in',
    'www.rbi.org.in',
    'amfiindia.com',
    'www.amfiindia.com',
    'mca.gov.in',
    'www.mca.gov.in',
  ].includes(hostname) || hostname.endsWith('.gov.in');
}

function isFragmentedPropertySource(hostname: string): boolean {
  return [
    '99acres.com',
    'www.99acres.com',
    'housing.com',
    'www.housing.com',
    'magicbricks.com',
    'www.magicbricks.com',
    'commonfloor.com',
    'www.commonfloor.com',
  ].includes(hostname);
}

function isGlobalStructuredFinanceApi(hostname: string): boolean {
  return hostname.includes('financialdatasets.ai') || hostname.includes('yahoo.com') || hostname.includes('yfinance');
}

export function assessSourceConfidence(input: AssessSourceConfidenceInput): SourceConfidenceReport {
  const hostnames = input.sourceUrls.map(hostnameFromUrl).filter(Boolean);

  if (hostnames.length === 0) {
    return {
      rating: 'low',
      notes: ['No verifiable sources were attached; treat conclusions as provisional and verify manually.'],
    };
  }

  if (hostnames.every(isOfficialIndianSource)) {
    return {
      rating: 'high',
      notes: ['Sources are official Indian exchange, regulator, or government domains, which are the strongest verification path.'],
    };
  }

  if (input.workflowId === 'india_property_underwriting' || input.workflowId === 'india_real_estate_market') {
    if (hostnames.every(isFragmentedPropertySource)) {
      return {
        rating: 'low',
        notes: ['Sources are fragmented listing or broker-style property portals; treat pricing, supply, and yield claims as directional only.'],
      };
    }
  }

  if (input.profileId === 'india' && hostnames.every(isGlobalStructuredFinanceApi)) {
    return {
      rating: 'medium',
      notes: ['Structured finance APIs are useful, but India coverage and symbol mapping can be uneven; verify key conclusions against local sources.'],
    };
  }

  return {
    rating: 'medium',
    notes: ['Source quality is mixed; separate official disclosures from secondary summaries and verify material claims.'],
  };
}
