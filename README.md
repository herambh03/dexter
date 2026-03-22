# PocketFM

PocketFM is an India-first autonomous research agent for investments and real estate.

It keeps the same core agent interface and feel as Dexter — planning, tool use, self-validation, scratchpads, and conversational research workflows — but is being adapted for Indian applicability by default.

## Product direction

PocketFM is being reoriented around:
- Indian public equities
- NSE/BSE-first market reasoning
- Indian mutual funds, ETFs, and REITs
- Indian macro and policy context
- Indian real-estate research and underwriting workflows

## Current status

This fork currently includes an initial India-first foundation:
- local fork and remote wiring for `herambh03/dexter`
- India research profile support in the system prompt
- rebrand foundation from Dexter to PocketFM
- explicit guidance for Indian investing and real-estate applicability

## Near-term roadmap

1. Make India mode the default operating profile
2. Add India-aware investment workflows
3. Add India real-estate research workflows
4. Add source-confidence and data-quality labeling
5. Add India-specific data/provider adapters

## Running locally

```bash
git clone https://github.com/herambh03/dexter.git
cd dexter
bun install
DEXTER_RESEARCH_PROFILE=india bun start
```

## Notes

- This project is intentionally keeping Dexter's agent-style interface and architecture.
- The main change is not cosmetic UI; it is India-specific reasoning, source selection, and workflow design.
- Real-estate intelligence in India will require browser/web-heavy workflows and source transparency because the data layer is fragmented.

## License

This fork inherits the upstream repository license unless changed explicitly.
