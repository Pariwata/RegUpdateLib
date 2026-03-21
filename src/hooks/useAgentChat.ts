import { useState, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { mockRegulations } from '../data/mockRegulations';
import { Regulation } from '../types/regulation';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function findRelevantRegulations(query: string): Regulation[] {
  const q = query.toLowerCase();
  return mockRegulations.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.agency.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.jurisdiction.toLowerCase().includes(q)
  );
}

function detectIntent(query: string): string {
  const q = query.toLowerCase();
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
  if (q.includes('summary') || q.includes('explain') || q.includes('what is') || q.includes('tell me about') || q.includes('describe'))
    return 'explain';
  if (q.includes('agency') || q.includes('agencies'))
    return 'agency';
  if (q.includes('category') || q.includes('categories') || q.includes('topic'))
    return 'category';
  if (q.includes('help') || q.includes('can you') || q.includes('what can'))
    return 'help';
  return 'general';
}

function generateResponse(query: string): string {
  const intent = detectIntent(query);
  const q = query.toLowerCase();

  if (intent === 'help') {
    return `I'm your Regulatory AI Assistant. I can help you with:\n\n- **Search regulations** — "Find regulations about privacy"\n- **Get summaries** — "Tell me about the AI Transparency Act"\n- **Count regulations** — "How many active regulations are there?"\n- **Filter by status** — "Show proposed regulations"\n- **Browse by agency** — "List EPA regulations"\n- **Find recent updates** — "What are the latest updates?"\n- **Compare topics** — "Compare cybersecurity regulations"\n\nJust ask me anything about the regulatory database!`;
  }

  if (intent === 'count') {
    if (q.includes('active')) {
      const count = mockRegulations.filter((r) => r.status === 'active').length;
      return `There are **${count} active regulations** in the database.`;
    }
    if (q.includes('proposed')) {
      const count = mockRegulations.filter((r) => r.status === 'proposed').length;
      return `There are **${count} proposed regulations** currently under review.`;
    }
    if (q.includes('repealed')) {
      const count = mockRegulations.filter((r) => r.status === 'repealed').length;
      return `There is **${count} repealed regulation** in the database.`;
    }
    if (q.includes('amended')) {
      const count = mockRegulations.filter((r) => r.status === 'amended').length;
      return `There are **${count} amended regulations** in the database.`;
    }
    return `The database contains **${mockRegulations.length} regulations** in total:\n- **${mockRegulations.filter((r) => r.status === 'active').length}** active\n- **${mockRegulations.filter((r) => r.status === 'proposed').length}** proposed\n- **${mockRegulations.filter((r) => r.status === 'amended').length}** amended\n- **${mockRegulations.filter((r) => r.status === 'repealed').length}** repealed`;
  }

  if (intent === 'recent') {
    const sorted = [...mockRegulations].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    const top5 = sorted.slice(0, 5);
    const lines = top5.map(
      (r) => `- **${r.title}** (${r.referenceNumber}) — updated ${r.lastUpdated}`
    );
    return `Here are the **5 most recently updated** regulations:\n\n${lines.join('\n')}`;
  }

  if (intent === 'status') {
    let status = '';
    if (q.includes('active')) status = 'active';
    else if (q.includes('proposed')) status = 'proposed';
    else if (q.includes('repealed')) status = 'repealed';
    else if (q.includes('amended')) status = 'amended';

    if (status) {
      const regs = mockRegulations.filter((r) => r.status === status);
      if (regs.length === 0) return `No ${status} regulations found.`;
      const lines = regs.map((r) => `- **${r.title}** (${r.agency})`);
      return `**${status.charAt(0).toUpperCase() + status.slice(1)} regulations (${regs.length}):**\n\n${lines.join('\n')}`;
    }
  }

  if (intent === 'agency') {
    const agencies = Array.from(new Set(mockRegulations.map((r) => r.agency))).sort();
    // Check if asking about a specific agency
    const matchedRegs = findRelevantRegulations(query);
    if (matchedRegs.length > 0 && !q.includes('all agencies') && !q.includes('list agencies')) {
      const lines = matchedRegs.map((r) => `- **${r.title}** — ${r.status}`);
      return `Found **${matchedRegs.length} regulation(s)** matching your query:\n\n${lines.join('\n')}`;
    }
    const lines = agencies.map((a) => {
      const count = mockRegulations.filter((r) => r.agency === a).length;
      return `- **${a}** (${count})`;
    });
    return `**Agencies in the database:**\n\n${lines.join('\n')}`;
  }

  if (intent === 'category') {
    const categories = Array.from(new Set(mockRegulations.map((r) => r.category))).sort();
    const lines = categories.map((c) => {
      const count = mockRegulations.filter((r) => r.category === c).length;
      return `- **${c}** (${count})`;
    });
    return `**Regulation categories:**\n\n${lines.join('\n')}`;
  }

  // For explain/list/compare/general — try to find relevant regulations
  const relevant = findRelevantRegulations(query);

  if (intent === 'explain' && relevant.length > 0) {
    const reg = relevant[0];
    return `**${reg.title}**\n\n- **Agency:** ${reg.agency}\n- **Status:** ${reg.status}\n- **Effective Date:** ${reg.effectiveDate}\n- **Jurisdiction:** ${reg.jurisdiction}\n- **Reference:** ${reg.referenceNumber}\n\n${reg.summary}\n\n**Tags:** ${reg.tags.join(', ')}`;
  }

  if (intent === 'compare' && relevant.length >= 2) {
    const lines = relevant.slice(0, 4).map(
      (r) =>
        `### ${r.title}\n- **Agency:** ${r.agency}\n- **Status:** ${r.status}\n- **Summary:** ${r.summary}\n`
    );
    return `Here's a comparison of **${Math.min(relevant.length, 4)} related regulations**:\n\n${lines.join('\n')}`;
  }

  if (relevant.length > 0) {
    const lines = relevant.slice(0, 6).map(
      (r) => `- **${r.title}** (${r.agency}) — ${r.status}`
    );
    const suffix = relevant.length > 6 ? `\n\n...and ${relevant.length - 6} more. Try refining your query.` : '';
    return `Found **${relevant.length} regulation(s)** related to your query:\n\n${lines.join('\n')}${suffix}\n\nWant more details on any of these? Just ask!`;
  }

  return `I couldn't find specific regulations matching "${query}". Try searching for:\n- A **topic** (e.g., "privacy", "cybersecurity", "emissions")\n- An **agency** (e.g., "EPA", "FDA", "FTC")\n- A **regulation status** (e.g., "active", "proposed")\n\nOr type **"help"** to see everything I can do!`;
}

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
