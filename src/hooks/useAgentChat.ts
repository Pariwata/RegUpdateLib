import { useState, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { mockRegulations } from '../data/mockRegulations';
import { Regulation } from '../types/regulation';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ---------------------------------------------------------------------------
// Fuzzy / keyword search
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'of', 'on', 'and', 'a', 'an', 'in', 'to', 'for',
  'it', 'by', 'or', 'be', 'as', 'do', 'me', 'my', 'so', 'up', 'if',
  'no', 'am', 'are', 'was', 'has', 'had', 'get', 'can', 'may',
  'all', 'any', 'its', 'not', 'but', 'out', 'new', 'now',
  'about', 'with', 'that', 'this', 'from', 'what', 'which',
  'tell', 'show', 'find', 'list', 'give', 'how', 'many',
  'regulations', 'regulation', 'related', 'regarding',
]);

function contentWords(text: string): string[] {
  return tokenize(text).filter((w) => !STOP_WORDS.has(w));
}

/** Score a regulation against query tokens. Higher = better match. */
function scoreRegulation(reg: Regulation, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const fields = [
    reg.title.toLowerCase(),
    reg.summary.toLowerCase(),
    reg.agency.toLowerCase(),
    reg.category.toLowerCase(),
    reg.jurisdiction.toLowerCase(),
    reg.referenceNumber.toLowerCase(),
    ...reg.tags.map((t) => t.toLowerCase()),
  ].join(' ');

  let score = 0;
  for (const token of queryTokens) {
    if (fields.includes(token)) {
      score += 1;
      // Bonus for title match
      if (reg.title.toLowerCase().includes(token)) score += 0.5;
      // Bonus for tag match
      if (reg.tags.some((t) => t.toLowerCase().includes(token))) score += 0.3;
    }
  }
  return score;
}

function findRelevantRegulations(query: string): Regulation[] {
  const q = query.toLowerCase();

  // First: try exact full-query matching (original behavior)
  const exact = mockRegulations.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.agency.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.jurisdiction.toLowerCase().includes(q)
  );
  if (exact.length > 0) return exact;

  // Fallback: fuzzy keyword matching — score each regulation by word overlap
  const tokens = contentWords(query);
  if (tokens.length === 0) return [];

  const scored = mockRegulations
    .map((r) => ({ reg: r, score: scoreRegulation(r, tokens) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.reg);
}

// ---------------------------------------------------------------------------
// Reference-number lookup
// ---------------------------------------------------------------------------

function findByReferenceNumber(query: string): Regulation | undefined {
  // Match patterns like FTC-2025-0042, EPA-2024-0118, etc.
  const refPattern = /[A-Z]{2,}(?:-[A-Z]{2,})?-\d{4}-\d{3,}/i;
  const match = query.match(refPattern);
  if (!match) return undefined;
  const ref = match[0].toUpperCase();
  return mockRegulations.find(
    (r) => r.referenceNumber.toUpperCase() === ref
  );
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function extractYear(query: string): number | null {
  const m = query.match(/\b(20\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}

function isThisYear(dateStr: string): boolean {
  const now = new Date();
  return new Date(dateStr).getFullYear() === now.getFullYear();
}

function isComingSoon(dateStr: string, withinDays: number = 180): boolean {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff <= withinDays * 24 * 60 * 60 * 1000;
}

// ---------------------------------------------------------------------------
// Tag search
// ---------------------------------------------------------------------------

function findByTag(tag: string): Regulation[] {
  const t = tag.toLowerCase();
  return mockRegulations.filter((r) =>
    r.tags.some((rt) => rt.toLowerCase().includes(t))
  );
}

// ---------------------------------------------------------------------------
// Suggested follow-up questions
// ---------------------------------------------------------------------------

function suggestFollowUps(intent: string, regs: Regulation[]): string {
  const suggestions: string[] = [];

  switch (intent) {
    case 'count':
    case 'stats':
      suggestions.push(
        'What regulations are coming into effect soon?',
        'Show me all proposed regulations',
        'List regulations by agency',
      );
      break;
    case 'list':
    case 'general':
      if (regs.length > 0) {
        suggestions.push(`Tell me about ${regs[0].referenceNumber}`);
        suggestions.push('Give me a breakdown by category');
        if (regs.length > 1) {
          suggestions.push(`Compare ${regs[0].title} with ${regs[1].title}`);
        }
      } else {
        suggestions.push(
          'Show me all active regulations',
          'What agencies are in the database?',
          'Give me stats on the regulations',
        );
      }
      break;
    case 'explain':
    case 'detail':
      if (regs.length > 0) {
        const r = regs[0];
        suggestions.push(`Show other ${r.status} regulations`);
        suggestions.push(`Find more regulations from ${r.agency}`);
        if (r.tags.length > 0) {
          suggestions.push(`Find regulations tagged with ${r.tags[0]}`);
        }
      }
      break;
    case 'recent':
    case 'timeline':
      suggestions.push(
        'How many proposed regulations are there?',
        'Show regulations effective this year',
        'Give me stats on the regulations',
      );
      break;
    case 'tag':
      suggestions.push(
        'Show me all categories',
        'What regulations are proposed?',
        'Give me stats on the regulations',
      );
      break;
    case 'status':
      suggestions.push(
        'What regulations are coming into effect soon?',
        'Show me all agencies',
        'Give me a breakdown by category',
      );
      break;
    case 'agency':
    case 'category':
      suggestions.push(
        'How many active regulations are there?',
        'Show me proposed regulations',
        'What regulations are coming into effect soon?',
      );
      break;
    case 'help':
      suggestions.push(
        'How many regulations are in the database?',
        'Show me recent updates',
        'Find regulations about cybersecurity',
      );
      break;
    default:
      suggestions.push(
        'Give me stats on the regulations',
        'What regulations are coming into effect soon?',
        'Type "help" to see all capabilities',
      );
  }

  const picked = suggestions.slice(0, 3);
  return `\n\n---\n**Suggested questions:**\n${picked.map((s) => `- "${s}"`).join('\n')}`;
}

// ---------------------------------------------------------------------------
// Intent detection (enhanced)
// ---------------------------------------------------------------------------

function detectIntent(query: string): string {
  const q = query.toLowerCase();

  // Reference-number lookup
  if (/[A-Z]{2,}(?:-[A-Z]{2,})?-\d{4}-\d{3,}/i.test(query)) return 'detail';

  // Stats / analytics
  if (
    q.includes('stats') ||
    q.includes('statistics') ||
    q.includes('analytics') ||
    q.includes('breakdown') ||
    q.includes('overview') ||
    q.includes('distribution')
  )
    return 'stats';

  // Compliance timeline
  if (
    q.includes('coming into effect') ||
    q.includes('upcoming') ||
    q.includes('timeline') ||
    q.includes('effective soon') ||
    q.includes('taking effect') ||
    q.includes('coming up') ||
    q.includes('due soon')
  )
    return 'timeline';

  // Tag-based search
  if (q.includes('tagged with') || q.includes('tagged as') || q.includes('tag '))
    return 'tag';

  // Date-aware queries
  if (
    q.includes('this year') ||
    q.includes('effective in') ||
    q.includes('from 20') ||
    q.includes('in 20') ||
    q.includes('regulations of 20') ||
    q.includes('year 20')
  )
    return 'date';

  // Existing intents (preserved)
  if (q.includes('how many') || q.includes('count') || q.includes('total'))
    return 'count';
  if (q.includes('list') || q.includes('show') || q.includes('find') || q.includes('search'))
    return 'list';
  if (q.includes('compare') || q.includes('difference') || q.includes('vs'))
    return 'compare';
  if (q.includes('latest') || q.includes('recent') || q.includes('newest') || q.includes('updated'))
    return 'recent';
  if (q.includes('status') || q.includes('active') || q.includes('proposed') || q.includes('repealed'))
    return 'status';
  if (
    q.includes('summary') ||
    q.includes('explain') ||
    q.includes('what is') ||
    q.includes('tell me about') ||
    q.includes('describe')
  )
    return 'explain';
  if (q.includes('agency') || q.includes('agencies'))
    return 'agency';
  if (q.includes('category') || q.includes('categories') || q.includes('topic'))
    return 'category';
  if (q.includes('help') || q.includes('can you') || q.includes('what can'))
    return 'help';

  return 'general';
}

// ---------------------------------------------------------------------------
// Multi-filter helpers
// ---------------------------------------------------------------------------

function applyMultiFilters(query: string): Regulation[] {
  const q = query.toLowerCase();
  let results = [...mockRegulations];

  // Filter by status if mentioned
  const statuses: Array<Regulation['status']> = ['active', 'proposed', 'repealed', 'amended'];
  for (const status of statuses) {
    if (q.includes(status)) {
      results = results.filter((r) => r.status === status);
    }
  }

  // Filter by agency keyword
  const agencyKeywords: Record<string, string> = {
    epa: 'Environmental Protection Agency',
    fda: 'Food and Drug Administration',
    ftc: 'Federal Trade Commission',
    osha: 'Occupational Safety and Health Administration',
    nist: 'National Institute of Standards and Technology',
    doj: 'Department of Justice',
    doe: 'Department of Energy',
    gsa: 'General Services Administration',
    cms: 'Centers for Medicare',
    occ: 'Office of the Comptroller',
    fincen: 'Financial Crimes Enforcement',
    cfpb: 'Consumer Financial Protection Bureau',
    nhtsa: 'National Highway Traffic Safety',
    cisa: 'Cybersecurity and Infrastructure Security Agency',
    bis: 'Bureau of Industry and Security',
    onc: 'Office of the National Coordinator',
    nydfs: 'New York Department of Financial Services',
  };

  for (const [abbr, fullName] of Object.entries(agencyKeywords)) {
    if (q.includes(abbr)) {
      results = results.filter((r) =>
        r.agency.toLowerCase().includes(fullName.toLowerCase())
      );
    }
  }

  // Filter by category keywords
  const categoryKeywords: Record<string, string> = {
    financial: 'Financial Services',
    finance: 'Financial Services',
    environmental: 'Environmental',
    environment: 'Environmental',
    privacy: 'Data Privacy',
    healthcare: 'Healthcare',
    health: 'Healthcare',
    technology: 'Technology',
    tech: 'Technology',
    labor: 'Labor & Employment',
    employment: 'Labor & Employment',
    trade: 'Trade & Commerce',
    commerce: 'Trade & Commerce',
    transportation: 'Transportation',
    transport: 'Transportation',
  };

  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (q.includes(keyword)) {
      results = results.filter((r) =>
        r.category.toLowerCase() === category.toLowerCase()
      );
      break; // Only apply one category filter
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Response generation (enhanced)
// ---------------------------------------------------------------------------

function generateResponse(query: string): string {
  const intent = detectIntent(query);
  const q = query.toLowerCase();

  // ---- HELP ----
  if (intent === 'help') {
    const body = `I'm your Regulatory AI Assistant. I can help you with:\n\n` +
      `- **Search regulations** -- "Find regulations about privacy"\n` +
      `- **Get details by reference** -- "Tell me about FTC-2025-0042"\n` +
      `- **Count regulations** -- "How many active regulations are there?"\n` +
      `- **Filter by status** -- "Show proposed regulations"\n` +
      `- **Multi-filter search** -- "active EPA regulations", "proposed financial regulations"\n` +
      `- **Browse by agency** -- "List EPA regulations"\n` +
      `- **Tag search** -- "Find regulations tagged with cybersecurity"\n` +
      `- **Date queries** -- "Regulations effective this year", "Regulations from 2025"\n` +
      `- **Statistics** -- "Give me stats", "Breakdown by category"\n` +
      `- **Compliance timeline** -- "What regulations are coming into effect soon?"\n` +
      `- **Recent updates** -- "What are the latest updates?"\n` +
      `- **Compare topics** -- "Compare cybersecurity regulations"\n\n` +
      `Just ask me anything about the regulatory database!`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- DETAIL by reference number ----
  if (intent === 'detail') {
    const reg = findByReferenceNumber(query);
    if (reg) {
      const body =
        `**${reg.title}**\n\n` +
        `| Field | Value |\n|---|---|\n` +
        `| **Reference** | ${reg.referenceNumber} |\n` +
        `| **Agency** | ${reg.agency} |\n` +
        `| **Status** | ${reg.status.charAt(0).toUpperCase() + reg.status.slice(1)} |\n` +
        `| **Category** | ${reg.category} |\n` +
        `| **Effective Date** | ${reg.effectiveDate} |\n` +
        `| **Last Updated** | ${reg.lastUpdated} |\n` +
        `| **Jurisdiction** | ${reg.jurisdiction} |\n\n` +
        `${reg.summary}\n\n` +
        `**Tags:** ${reg.tags.join(', ')}`;
      return body + suggestFollowUps(intent, [reg]);
    }
    return `I couldn't find a regulation with that reference number. Please check the format (e.g., FTC-2025-0042) and try again.` +
      suggestFollowUps(intent, []);
  }

  // ---- STATISTICS / ANALYTICS ----
  if (intent === 'stats') {
    const total = mockRegulations.length;
    const byStatus = {
      active: mockRegulations.filter((r) => r.status === 'active').length,
      proposed: mockRegulations.filter((r) => r.status === 'proposed').length,
      amended: mockRegulations.filter((r) => r.status === 'amended').length,
      repealed: mockRegulations.filter((r) => r.status === 'repealed').length,
    };

    const categoryCounts = mockRegulations.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
    const categoryLines = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => `| ${cat} | ${count} |`);

    const agencyCounts = mockRegulations.reduce<Record<string, number>>((acc, r) => {
      acc[r.agency] = (acc[r.agency] || 0) + 1;
      return acc;
    }, {});
    const topAgencies = Object.entries(agencyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([agency, count]) => `| ${agency} | ${count} |`);

    const jurisdictionCounts = mockRegulations.reduce<Record<string, number>>((acc, r) => {
      acc[r.jurisdiction] = (acc[r.jurisdiction] || 0) + 1;
      return acc;
    }, {});
    const jurisdictionLines = Object.entries(jurisdictionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([j, count]) => `| ${j} | ${count} |`);

    const body =
      `**Regulatory Database Statistics**\n\n` +
      `**Total regulations:** ${total}\n\n` +
      `**By Status:**\n| Status | Count |\n|---|---|\n` +
      `| Active | ${byStatus.active} |\n` +
      `| Proposed | ${byStatus.proposed} |\n` +
      `| Amended | ${byStatus.amended} |\n` +
      `| Repealed | ${byStatus.repealed} |\n\n` +
      `**By Category:**\n| Category | Count |\n|---|---|\n` +
      `${categoryLines.join('\n')}\n\n` +
      `**Top 5 Agencies:**\n| Agency | Count |\n|---|---|\n` +
      `${topAgencies.join('\n')}\n\n` +
      `**By Jurisdiction:**\n| Jurisdiction | Count |\n|---|---|\n` +
      `${jurisdictionLines.join('\n')}`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- COMPLIANCE TIMELINE ----
  if (intent === 'timeline') {
    const upcoming = mockRegulations
      .filter((r) => isComingSoon(r.effectiveDate, 365))
      .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

    if (upcoming.length === 0) {
      // Show regulations with future effective dates regardless of window
      const futureRegs = mockRegulations
        .filter((r) => new Date(r.effectiveDate) > new Date())
        .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
      if (futureRegs.length === 0) {
        return `All regulations in the database have already taken effect.` +
          suggestFollowUps(intent, []);
      }
      const lines = futureRegs.map(
        (r) => `| ${r.effectiveDate} | ${r.title} | ${r.status} | ${r.agency} |`
      );
      const body =
        `**Upcoming Compliance Timeline:**\n\n` +
        `| Effective Date | Regulation | Status | Agency |\n|---|---|---|---|\n` +
        `${lines.join('\n')}`;
      return body + suggestFollowUps(intent, futureRegs);
    }

    const lines = upcoming.map(
      (r) => `| ${r.effectiveDate} | ${r.title} | ${r.status} | ${r.agency} |`
    );
    const body =
      `**Upcoming Compliance Timeline** (next 12 months):\n\n` +
      `| Effective Date | Regulation | Status | Agency |\n|---|---|---|---|\n` +
      `${lines.join('\n')}\n\n` +
      `There are **${upcoming.length} regulation(s)** with upcoming effective dates.`;
    return body + suggestFollowUps(intent, upcoming);
  }

  // ---- TAG-BASED SEARCH ----
  if (intent === 'tag') {
    const tagMatch = q.match(/tagged?\s+(?:with|as|)\s*(.+)/);
    const tagQuery = tagMatch ? tagMatch[1].trim() : '';
    if (tagQuery) {
      const regs = findByTag(tagQuery);
      if (regs.length === 0) {
        return `No regulations found tagged with "${tagQuery}". Try a different tag such as: privacy, cybersecurity, compliance, AI, climate.` +
          suggestFollowUps(intent, []);
      }
      const lines = regs.map(
        (r) => `- **${r.title}** (${r.agency}) -- ${r.status}\n  Tags: ${r.tags.join(', ')}`
      );
      const body = `Found **${regs.length} regulation(s)** tagged with "${tagQuery}":\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, regs);
    }
    // List all available tags
    const allTags = Array.from(new Set(mockRegulations.flatMap((r) => r.tags))).sort();
    const body = `**Available tags in the database:**\n\n${allTags.map((t) => `\`${t}\``).join(', ')}\n\nTry asking: "Find regulations tagged with cybersecurity"`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- DATE-AWARE QUERIES ----
  if (intent === 'date') {
    const year = extractYear(query);
    let regs: Regulation[];

    if (q.includes('this year')) {
      regs = mockRegulations.filter((r) => isThisYear(r.effectiveDate));
      const label = `effective this year (${new Date().getFullYear()})`;
      if (regs.length === 0) {
        return `No regulations found ${label}.` + suggestFollowUps(intent, []);
      }
      const lines = regs.map(
        (r) => `- **${r.title}** (${r.agency}) -- effective ${r.effectiveDate}, status: ${r.status}`
      );
      const body = `Found **${regs.length} regulation(s)** ${label}:\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, regs);
    }

    if (year) {
      regs = mockRegulations.filter(
        (r) => new Date(r.effectiveDate).getFullYear() === year
      );
      if (regs.length === 0) {
        return `No regulations found with an effective date in ${year}.` +
          suggestFollowUps(intent, []);
      }
      const lines = regs.map(
        (r) => `- **${r.title}** (${r.agency}) -- effective ${r.effectiveDate}, status: ${r.status}`
      );
      const body = `Found **${regs.length} regulation(s)** effective in **${year}**:\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, regs);
    }

    return `I couldn't determine the date range you're looking for. Try something like "regulations effective this year" or "regulations from 2025".` +
      suggestFollowUps(intent, []);
  }

  // ---- COUNT ----
  if (intent === 'count') {
    if (q.includes('active')) {
      const count = mockRegulations.filter((r) => r.status === 'active').length;
      return `There are **${count} active regulations** in the database.` +
        suggestFollowUps(intent, []);
    }
    if (q.includes('proposed')) {
      const count = mockRegulations.filter((r) => r.status === 'proposed').length;
      return `There are **${count} proposed regulations** currently under review.` +
        suggestFollowUps(intent, []);
    }
    if (q.includes('repealed')) {
      const count = mockRegulations.filter((r) => r.status === 'repealed').length;
      return `There is **${count} repealed regulation(s)** in the database.` +
        suggestFollowUps(intent, []);
    }
    if (q.includes('amended')) {
      const count = mockRegulations.filter((r) => r.status === 'amended').length;
      return `There are **${count} amended regulations** in the database.` +
        suggestFollowUps(intent, []);
    }
    const body = `The database contains **${mockRegulations.length} regulations** in total:\n` +
      `- **${mockRegulations.filter((r) => r.status === 'active').length}** active\n` +
      `- **${mockRegulations.filter((r) => r.status === 'proposed').length}** proposed\n` +
      `- **${mockRegulations.filter((r) => r.status === 'amended').length}** amended\n` +
      `- **${mockRegulations.filter((r) => r.status === 'repealed').length}** repealed`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- RECENT ----
  if (intent === 'recent') {
    const sorted = [...mockRegulations].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    const top5 = sorted.slice(0, 5);
    const lines = top5.map(
      (r) => `- **${r.title}** (${r.referenceNumber}) -- updated ${r.lastUpdated}`
    );
    const body = `Here are the **5 most recently updated** regulations:\n\n${lines.join('\n')}`;
    return body + suggestFollowUps(intent, top5);
  }

  // ---- STATUS (multi-filter aware) ----
  if (intent === 'status') {
    // Try multi-filter first (e.g., "active EPA regulations")
    const multiResults = applyMultiFilters(query);
    if (multiResults.length < mockRegulations.length && multiResults.length > 0) {
      const lines = multiResults.map(
        (r) => `- **${r.title}** (${r.agency}) -- ${r.status}`
      );
      const body = `Found **${multiResults.length} regulation(s)** matching your filters:\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, multiResults);
    }

    let status = '';
    if (q.includes('active')) status = 'active';
    else if (q.includes('proposed')) status = 'proposed';
    else if (q.includes('repealed')) status = 'repealed';
    else if (q.includes('amended')) status = 'amended';

    if (status) {
      const regs = mockRegulations.filter((r) => r.status === status);
      if (regs.length === 0) {
        return `No ${status} regulations found.` + suggestFollowUps(intent, []);
      }
      const lines = regs.map((r) => `- **${r.title}** (${r.agency})`);
      const body = `**${status.charAt(0).toUpperCase() + status.slice(1)} regulations (${regs.length}):**\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, regs);
    }
  }

  // ---- AGENCY ----
  if (intent === 'agency') {
    const agencies = Array.from(new Set(mockRegulations.map((r) => r.agency))).sort();
    const matchedRegs = findRelevantRegulations(query);
    if (matchedRegs.length > 0 && !q.includes('all agencies') && !q.includes('list agencies')) {
      const lines = matchedRegs.map((r) => `- **${r.title}** -- ${r.status}`);
      const body = `Found **${matchedRegs.length} regulation(s)** matching your query:\n\n${lines.join('\n')}`;
      return body + suggestFollowUps(intent, matchedRegs);
    }
    const lines = agencies.map((a) => {
      const count = mockRegulations.filter((r) => r.agency === a).length;
      return `- **${a}** (${count})`;
    });
    const body = `**Agencies in the database:**\n\n${lines.join('\n')}`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- CATEGORY ----
  if (intent === 'category') {
    const categories = Array.from(new Set(mockRegulations.map((r) => r.category))).sort();
    const lines = categories.map((c) => {
      const count = mockRegulations.filter((r) => r.category === c).length;
      return `- **${c}** (${count})`;
    });
    const body = `**Regulation categories:**\n\n${lines.join('\n')}`;
    return body + suggestFollowUps(intent, []);
  }

  // ---- MULTI-FILTER for list intent ----
  if (intent === 'list') {
    const multiResults = applyMultiFilters(query);
    if (multiResults.length < mockRegulations.length && multiResults.length > 0) {
      const lines = multiResults.map(
        (r) => `- **${r.title}** (${r.agency}) -- ${r.status}`
      );
      const suffix =
        multiResults.length > 8
          ? `\n\n...showing first 8 of ${multiResults.length}. Try refining your query.`
          : '';
      const body = `Found **${multiResults.length} regulation(s)** matching your filters:\n\n${lines.slice(0, 8).join('\n')}${suffix}`;
      return body + suggestFollowUps(intent, multiResults);
    }
  }

  // ---- EXPLAIN / LIST / COMPARE / GENERAL — find relevant regulations ----
  const relevant = findRelevantRegulations(query);

  if (intent === 'explain' && relevant.length > 0) {
    const reg = relevant[0];
    const body =
      `**${reg.title}**\n\n` +
      `- **Agency:** ${reg.agency}\n` +
      `- **Status:** ${reg.status}\n` +
      `- **Effective Date:** ${reg.effectiveDate}\n` +
      `- **Jurisdiction:** ${reg.jurisdiction}\n` +
      `- **Reference:** ${reg.referenceNumber}\n\n` +
      `${reg.summary}\n\n` +
      `**Tags:** ${reg.tags.join(', ')}`;
    return body + suggestFollowUps(intent, [reg]);
  }

  if (intent === 'compare' && relevant.length >= 2) {
    const lines = relevant.slice(0, 4).map(
      (r) =>
        `### ${r.title}\n- **Agency:** ${r.agency}\n- **Status:** ${r.status}\n- **Summary:** ${r.summary}\n`
    );
    const body = `Here's a comparison of **${Math.min(relevant.length, 4)} related regulations**:\n\n${lines.join('\n')}`;
    return body + suggestFollowUps(intent, relevant.slice(0, 4));
  }

  if (relevant.length > 0) {
    const lines = relevant.slice(0, 6).map(
      (r) => `- **${r.title}** (${r.agency}) -- ${r.status}`
    );
    const suffix =
      relevant.length > 6
        ? `\n\n...and ${relevant.length - 6} more. Try refining your query.`
        : '';
    const body = `Found **${relevant.length} regulation(s)** related to your query:\n\n${lines.join('\n')}${suffix}\n\nWant more details on any of these? Just ask!`;
    return body + suggestFollowUps(intent, relevant);
  }

  return (
    `I couldn't find specific regulations matching "${query}". Try searching for:\n` +
    `- A **topic** (e.g., "privacy", "cybersecurity", "emissions")\n` +
    `- An **agency** (e.g., "EPA", "FDA", "FTC")\n` +
    `- A **reference number** (e.g., "FTC-2025-0042")\n` +
    `- A **tag** (e.g., "regulations tagged with AI")\n` +
    `- A **regulation status** (e.g., "active", "proposed")\n\n` +
    `Or type **"help"** to see everything I can do!` +
    suggestFollowUps('fallback', [])
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I\'m your Regulatory AI Assistant. Ask me about any regulation, agency, or compliance topic. Type **"help"** to see what I can do.',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate thinking delay
    setTimeout(() => {
      const response = generateResponse(content);
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 400 + Math.random() * 600);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Chat cleared. How can I help you with regulatory information?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
