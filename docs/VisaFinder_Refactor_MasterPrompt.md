# **VisaOnTrack — Visa Finder Refactor (Business-Aligned Pay-to-Stay Prioritization)  
Master Prompt v1.0**

Use this prompt to align the Visa Finder logic, scoring, eligibility, and UX with the business goal of prioritizing **pay-to-stay long-term visas** and **warm prospects inside Thailand**, while excluding tourist visas and correctly modeling conversion paths.

---

# **🎯 Core Intent of the System**

Refactor the Visa Finder so that it:

- Prioritizes **pay-to-stay, revenue-generating long-term visas**
- Strongly favors users **already inside Thailand (warm prospects)**
- Treats **ED visa** as a legitimate long-term pay-to-stay solution
- Removes **tourist visas** (SETV, METV) from all recommendations
- Understands **conversion paths** (in-country vs border run)
- Builds recommendations based on **score**, not binary filters
- Implements a **clean data model**, **clean scoring**, and **clear tradeoff messaging**

This prompt must guide all logic, code, scoring, and UI copy.

---

# **1. Visa Profiles — Data Model Update**

Extend `VisaProfile` with the following fields:

```ts
export interface VisaProfile {
  code: VisaCode;
  isPayToStay: boolean;
  baseLocation: 'inside' | 'outside' | 'both';
  canConvertFromInside: boolean;
  requiresBorderRunForConversion: boolean;
  minSavings?: number;
  recommendedBudgetBand?: 'low' | 'medium' | 'high';
  isTouristVisa?: boolean;
  isExcluded?: boolean;
  revenuePriorityWeight?: number;

  hardRequirements: {
    notes?: string;
  };
}
```

### **Mark Pay-to-Stay Visas**
Set `isPayToStay: true` for:

- DTV  
- LTR (all variants)  
- PRIVILEGE  
- RET_OA  
- RET_OX  
- ED_LANG  
- O_MARRIAGE (if monetizable)  
- O_GUARDIAN (if monetizable)

### **Tourist visas**

- SETV → `isTouristVisa: true`, `isExcluded: true`
- METV → `isTouristVisa: true`, `isExcluded: true`

Keep them in the data model but **excluded** from recommendation output.

### **Location Adjustments**

For DTV, LTR, PRIV — change:

- `baseLocation: 'both'`
- `canConvertFromInside: true`
- Add conversion notes in `hardRequirements.notes`

---

# **2. Eligibility Rules (`eligibilityUtils.ts`)**

Eligibility must **only check hard blockers**:

- ABSOLUTE age limits  
- ABSOLUTE minimum funds or income  
- Hard legal impossibilities  
- Exclude visas with `isExcluded: true`  
- Exclude tourist visas  

Do **NOT** filter out pay-to-stay visas for inside-Thailand users.

---

# **3. Scoring System (`recommendations.ts`)**

Central scoring config:

```ts
const SCORING_WEIGHTS = {
  warmProspectBoost: 0.4,
  locationInsidePayToStay: 1.0,
  locationOutsidePayToStay: 0.7,
  locationInsideNonPayToStay: 0.3,

  budgetBonusHigh: 0.25,
  budgetBonusMedium: 0.2,
  budgetBonusLowED: 0.3,
};
```

### **Warm Prospect Priority**
```ts
if (derived.location === 'inside' && profile.isPayToStay) {
  score += SCORING_WEIGHTS.warmProspectBoost;
}
```

### **Budget Bands**
```ts
function getBudgetBand(savings: number): 'low' | 'medium' | 'high' {
  if (savings >= 2_000_000) return 'high';
  if (savings >= 500_000) return 'medium';
  return 'low';
}
```

Apply scoring:

- High budget → LTR/PRIV boosted; ED visible  
- Medium budget → DTV/PRIV boosted; ED lightly boosted  
- Low budget → ED boosted heavily  

### **Location Scoring**
```
inside + pay-to-stay → 1.0  
outside + pay-to-stay → 0.7  
inside + non-pay-to-stay → 0.3  
```

---

# **4. Conversion Modeling**

- `requiresBorderRunForConversion: true`  
  → “Typically requires a short border run. A provider will guide you.”

- `canConvertFromInside: true`  
  → “Often possible to begin or convert from inside Thailand.”

---

# **5. Filtering Logic**

Exclude:

- `isTouristVisa: true`
- `isExcluded: true`

Include all other visas, even if requiring conversion or border run.

---

# **6. UI/UX Messaging**

### **Badges**
- “Available for conversion from inside Thailand”
- “Border run required”

### **Warm Prospect Message**
> “Because you’re already in Thailand, several long-stay visas may be activated or converted from your current location.”

### **ED Visa Messaging**
> “Long-stay education visa. Budget-friendly pay-to-stay option. Conditions vary — use vetted schools.”

---

# **7. Test Scenarios**

1. Inside + 800k–3M → DTV/PRIV top, ED visible  
2. Inside + 500k+ → DTV top, ED visible  
3. Inside + 50 yrs + 800k → RET_OA/PRIV top, ED visible  
4. Inside + <500k → ED #1  
5. Inside + 2M+ → LTR/PRIV top, ED lower  
6. Outside + 500k+ → DTV appears but lower  
7. Any → No tourist visas  

---

# **8. Implementation Checklist**

- Update `visaProfiles.ts`
- Add new flags  
- Add scoring config  
- Update eligibility logic  
- Add conversion notes  
- Add UI badges + messaging  
- Remove tourist visas via `isExcluded`  
- Ensure ED is never filtered out  

---

# **9. Success Metrics**

- Pay-to-stay visas prioritized  
- ED treated as legitimate  
- Location = strong business signal  
- Tourist visas never appear  
- Conversion paths clear  
- Scoring easy to adjust  
- System future-proof  

---

