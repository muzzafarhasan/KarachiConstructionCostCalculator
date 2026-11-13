# Karachi Construction Cost Calculator

A single-file, browser-based calculator that estimates the total construction cost and the cost per **square yard** of a plot in Karachi, Pakistan. Everything is driven by editable material and labour rates and recalculates live as you type.

> **Default rates are indicative Karachi market estimates.** Update them with today's supplier quotes before relying on the result. Quantities use thumb rules, not a bill of quantities (BOQ).

## Quick start

1. Open `karachi-construction-cost.html` in any modern browser (Chrome, Edge, Firefox, Safari).
2. Enter your plot area, floors, coverage and package.
3. Edit any rate or consumption norm. Results update immediately.

No installation, build tools, frameworks or server are needed. The only external resource is Chart.js, loaded from a CDN; if it can't load, the page falls back to a pure-CSS bar chart automatically.

## Features

- **Live recalculation** on every input change, with no submit button
- **Collapsible input cards**
  - A: Plot details (area in sq yd / sq ft / sq m, floors, coverage %, package)
  - B: Structure material rates (cement, steel, sand, crush, bricks, water, wastage)
  - C: Finishes (shown only for Standard and A-Class packages)
  - D: Labour and services (labour rate, margin, contingency, approval and utility charges)
  - E: Consumption norms ("Engineering assumptions — adjust to match your BOQ")
- **Construction packages** that auto-fill finish rates with presets you can override
- **Unit selectors** for steel (per kg or tonne), sand and crush (per cft or 100 cft) and doors and windows (per sq ft or lump sum); changing a unit converts the value so the real rate is preserved
- **Results panel** (sticky on desktop) with total cost, cost per sq yd, cost per sq ft and covered area, plus an itemised breakdown with quantity, unit, rate, amount and % of total
- **Cost-share chart** by category (Structure, Finishes, Labour, Services, Contingency, Profit)
- **Steel sensitivity table** showing cost per sq yd at −20%, −10%, 0, +10% and +20% steel rates
- **Reset to Karachi defaults** button
- **Print / Save as PDF** with a clean print stylesheet
- **CSV export** of the full breakdown
- **Auto-save** of all inputs to `localStorage`
- **Input validation:** blank or negative values are treated as 0 with an inline warning; floors have a minimum of 1 and coverage is capped at 100%
- **Responsive and accessible:** single column on mobile, two columns on desktop, proper labels, keyboard navigation and tooltips (?) on every input

## How it calculates

All internal math is in square feet (1 sq yd = 9 sq ft; 1 sq m = 10.7639 sq ft).

```
Covered area (sq ft)  = plot area (sq ft) × (ground coverage% + (floors − 1) × upper coverage%)
Material quantity     = covered area × consumption norm × (1 + wastage%)
Material cost         = quantity × rate
Water                 = litres ÷ litres per tanker → tankers × tanker rate
Structure subtotal    = sum of material costs
Finishes subtotal     = covered area × sum of finish rates (doors & windows may be a lump sum)
Labour subtotal       = covered area × labour rate
Services              = approval charges + utility charges
Subtotal              = structure + finishes + labour + services
Total                 = subtotal × (1 + contingency%) × (1 + contractor margin%)
Cost per sq ft        = total ÷ covered area
Cost per sq yd        = cost per sq ft × 9
```

The same formulas are available inside the app in the collapsible **Formulas & Assumptions** panel.

## Default values

Values marked as given were specified in the original brief; the rest are estimates chosen as sensible starting points.

| Input | Default | Source |
|---|---|---|
| Plot area | 120 sq yd | Estimate |
| Floors | 2 (ground + 1) | Estimate |
| Ground / upper coverage | 100% / 80% | Given |
| Cement | PKR 1,400 / 50 kg bag | Given |
| Steel (Grade 60) | PKR 270 / kg | Given |
| Steel (Grade 40) | PKR 255 / kg | Estimate |
| Sand | PKR 95 / cft | Given |
| Crush | PKR 100 / cft | Given |
| Bricks | PKR 24,000 / 1,000 | Given |
| Water tanker | PKR 3,500 / tanker (4,546 litres, i.e. 1,000 imperial gallons) | Given |
| Wastage | 5% | Given |
| Labour | PKR 550 / sq ft | Given |
| Contractor margin | 10% | Given |
| Contingency | 5% | Given |
| Approval charges | PKR 75,000 | Estimate |
| Utility charges | PKR 100,000 | Estimate |

### Consumption norms (per sq ft of covered area)

| Material | Default |
|---|---|
| Cement | 0.45 bags |
| Steel | 4.5 kg |
| Sand | 2.0 cft |
| Crush | 1.5 cft |
| Bricks | 9 nos |
| Water | 1.5 litres |

### Finish presets (PKR per sq ft, estimates)

| Item | Grey Structure | Standard | A-Class |
|---|---|---|---|
| Flooring / tiles | 0 | 250 | 650 |
| Plaster + paint | 0 | 180 | 320 |
| Doors & windows | 0 | 220 | 500 |
| Electrical | 0 | 120 | 240 |
| Plumbing & sanitary | 0 | 150 | 380 |

### Example output

With the defaults (120 sq yd, 2 floors, Grey Structure): covered area is 1,944 sq ft, total is about PKR 71 lakh, which is about PKR 3,652 per sq ft or PKR 32,872 per sq yd.

## Customising

- **Rates and norms:** change them in the form, since everything is stored in your browser.
- **Different defaults or presets:** edit the `GROUPS` array (field defaults), `PRESETS` (finish rates by package) and `STEEL_GRADE_RATE` near the top of the `<script>` block.
- **Number format:** formatting uses Pakistani/Indian digit grouping (e.g. PKR 12,45,000) via `toLocaleString('en-IN')`. Change the locale in the `nf()` helper for standard commas.

## Data and privacy

Your inputs are saved only in your browser's `localStorage` (key `karachiConstructionCost.v1`). Nothing is sent to any server. Use **Reset to Karachi defaults** to clear the saved data.

## Limitations

- Estimates only, not a substitute for a BOQ, structural design or contractor quotation.
- Thumb-rule consumption norms vary with design, soil, number of storeys and specification.
- Market rates change frequently; always confirm with current supplier quotes.
- Government approval and utility charges vary by authority, plot size and project type.

## Files

| File | Description |
|---|---|
| `karachi-construction-cost.html` | The complete calculator (HTML, CSS and JavaScript in one file) |
| `README.md` | This document |
