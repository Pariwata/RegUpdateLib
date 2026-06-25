import { renderHook, act } from '@testing-library/react';
import { useAgentChat } from './useAgentChat';
import { mockRegulations } from '../data/mockRegulations';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

/** Helper: send a message and advance timers so the async response lands. */
function sendAndFlush(
  result: { current: ReturnType<typeof useAgentChat> },
  message: string
) {
  act(() => {
    result.current.sendMessage(message);
  });
  act(() => {
    jest.advanceTimersByTime(1500); // max possible delay is 400 + 600 = 1000ms
  });
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

describe('useAgentChat - initialization', () => {
  it('starts with a single welcome message from the assistant', () => {
    const { result } = renderHook(() => useAgentChat());

    expect(result.current.messages).toHaveLength(1);
    const welcome = result.current.messages[0];
    expect(welcome.role).toBe('assistant');
    expect(welcome.id).toBe('welcome');
    expect(welcome.content).toContain('Regulatory AI Assistant');
    expect(welcome.timestamp).toBeInstanceOf(Date);
  });

  it('isLoading is false on init', () => {
    const { result } = renderHook(() => useAgentChat());
    expect(result.current.isLoading).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Sending messages
// ---------------------------------------------------------------------------

describe('useAgentChat - sendMessage', () => {
  it('adds a user message immediately and sets isLoading', () => {
    const { result } = renderHook(() => useAgentChat());

    act(() => {
      result.current.sendMessage('hello');
    });

    // User message appended right away
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].role).toBe('user');
    expect(result.current.messages[1].content).toBe('hello');
    expect(result.current.isLoading).toBe(true);
  });

  it('appends an assistant response after the simulated delay', () => {
    const { result } = renderHook(() => useAgentChat());

    sendAndFlush(result, 'hello');

    // welcome + user + assistant = 3
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.isLoading).toBe(false);
  });

  it('isLoading becomes true after sending and false after response', () => {
    const { result } = renderHook(() => useAgentChat());

    act(() => {
      result.current.sendMessage('help');
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.isLoading).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Help intent
// ---------------------------------------------------------------------------

describe('useAgentChat - help intent', () => {
  it('"help" query returns help text listing capabilities', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'help');

    const response = result.current.messages[2].content;
    expect(response).toContain('Regulatory AI Assistant');
    expect(response).toContain('Search regulations');
    expect(response).toContain('Count regulations');
    expect(response).toContain('Filter by status');
    expect(response).toContain('Suggested questions');
  });

  it('"what can you do" also triggers help', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'What can you do?');

    const response = result.current.messages[2].content;
    expect(response).toContain('Regulatory AI Assistant');
  });
});

// ---------------------------------------------------------------------------
// Count intent
// ---------------------------------------------------------------------------

describe('useAgentChat - count intent', () => {
  const activeCount = mockRegulations.filter((r) => r.status === 'active').length;
  const proposedCount = mockRegulations.filter((r) => r.status === 'proposed').length;
  const repealedCount = mockRegulations.filter((r) => r.status === 'repealed').length;
  const amendedCount = mockRegulations.filter((r) => r.status === 'amended').length;
  const totalCount = mockRegulations.length;

  it('returns total count for a generic count query', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'How many regulations are there?');

    const response = result.current.messages[2].content;
    expect(response).toContain(`${totalCount} regulations`);
    expect(response).toContain(`${activeCount}** active`);
    expect(response).toContain(`${proposedCount}** proposed`);
  });

  it('counts active regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'How many active regulations?');

    const response = result.current.messages[2].content;
    expect(response).toContain(`${activeCount} active regulations`);
  });

  it('counts proposed regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'How many proposed regulations?');

    const response = result.current.messages[2].content;
    expect(response).toContain(`${proposedCount} proposed regulations`);
  });

  it('counts repealed regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'count repealed regulations');

    const response = result.current.messages[2].content;
    expect(response).toContain(`${repealedCount} repealed regulation`);
  });

  it('counts amended regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'total amended regulations');

    const response = result.current.messages[2].content;
    expect(response).toContain(`${amendedCount} amended regulations`);
  });
});

// ---------------------------------------------------------------------------
// Search (general intent via fuzzy keyword matching)
// ---------------------------------------------------------------------------

describe('useAgentChat - search / general intent', () => {
  it('finds regulations matching a topic keyword', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'privacy');

    const response = result.current.messages[2].content;
    expect(response).toContain('Consumer Data Protection Standards');
  });

  it('finds regulations by agency abbreviation', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'EPA');

    const response = result.current.messages[2].content;
    expect(response).toContain('Environmental Protection Agency');
  });

  it('finds regulations by tag keyword', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'cybersecurity');

    const response = result.current.messages[2].content;
    expect(response).toContain('Digital Banking Security Framework');
  });
});

// ---------------------------------------------------------------------------
// Status filter intent
// ---------------------------------------------------------------------------

describe('useAgentChat - status filter intent', () => {
  // The status intent uses applyMultiFilters first. Queries with a status
  // keyword (but without list/show/find/search) trigger the status intent.

  it('filters active regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'active regulations status');

    const response = result.current.messages[2].content;
    const activeCount = mockRegulations.filter((r) => r.status === 'active').length;
    // applyMultiFilters returns "Found **N regulation(s)** matching your filters:"
    expect(response).toContain(`${activeCount} regulation(s)`);
    expect(response).toContain('matching your filters');
  });

  it('filters proposed regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'status proposed');

    const response = result.current.messages[2].content;
    const proposedCount = mockRegulations.filter((r) => r.status === 'proposed').length;
    expect(response).toContain(`${proposedCount} regulation(s)`);
  });

  it('filters amended regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'amended status');

    const response = result.current.messages[2].content;
    const amendedCount = mockRegulations.filter((r) => r.status === 'amended').length;
    expect(response).toContain(`${amendedCount} regulation(s)`);
  });
});

// ---------------------------------------------------------------------------
// Recent / latest intent
// ---------------------------------------------------------------------------

describe('useAgentChat - recent / latest intent', () => {
  it('returns the 5 most recently updated regulations', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'What are the latest updates?');

    const response = result.current.messages[2].content;
    expect(response).toContain('5 most recently updated');

    // Verify the top results are the most recent by lastUpdated
    const sorted = [...mockRegulations].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    expect(response).toContain(sorted[0].title);
    expect(response).toContain(sorted[1].title);
  });

  it('"recent" keyword also triggers the recent intent', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'recent regulations');

    const response = result.current.messages[2].content;
    expect(response).toContain('most recently updated');
  });
});

// ---------------------------------------------------------------------------
// Agency intent
// ---------------------------------------------------------------------------

describe('useAgentChat - agency intent', () => {
  it('lists all agencies when asked broadly', () => {
    const { result } = renderHook(() => useAgentChat());
    // "all agencies" prevents the specific-match branch from taking over
    sendAndFlush(result, 'What are all agencies in the database?');

    const response = result.current.messages[2].content;
    expect(response).toContain('Agencies in the database');
    expect(response).toContain('Environmental Protection Agency (EPA)');
    expect(response).toContain('Federal Trade Commission (FTC)');
  });
});

// ---------------------------------------------------------------------------
// Category intent
// ---------------------------------------------------------------------------

describe('useAgentChat - category intent', () => {
  it('lists all categories with counts', () => {
    const { result } = renderHook(() => useAgentChat());
    // "categories" triggers category intent (no list/show/find/search keywords)
    sendAndFlush(result, 'What categories are there?');

    const response = result.current.messages[2].content;
    expect(response).toContain('Regulation categories');
    expect(response).toContain('Data Privacy');
    expect(response).toContain('Technology');
    expect(response).toContain('Financial Services');
  });
});

// ---------------------------------------------------------------------------
// Explain intent
// ---------------------------------------------------------------------------

describe('useAgentChat - explain intent', () => {
  it('returns regulation details via general intent with a matching keyword', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'telehealth');

    const response = result.current.messages[2].content;
    expect(response).toContain('Telehealth Practice Standards');
    expect(response).toContain('CMS');
  });

  it('falls back when explain intent finds no matching regulation', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'tell me about something nonexistent');

    const response = result.current.messages[2].content;
    expect(response).toContain("couldn't find specific regulations");
  });
});

// ---------------------------------------------------------------------------
// Unknown / fallback
// ---------------------------------------------------------------------------

describe('useAgentChat - unknown query', () => {
  it('returns a helpful fallback for unrecognized queries', () => {
    const { result } = renderHook(() => useAgentChat());
    sendAndFlush(result, 'xyzzy foobarbaz');

    const response = result.current.messages[2].content;
    expect(response).toContain("couldn't find specific regulations");
    expect(response).toContain('help');
  });
});

// ---------------------------------------------------------------------------
// clearChat
// ---------------------------------------------------------------------------

describe('useAgentChat - clearChat', () => {
  it('resets to a single welcome message', () => {
    const { result } = renderHook(() => useAgentChat());

    // Send a message first so there is conversation history
    sendAndFlush(result, 'help');
    expect(result.current.messages.length).toBeGreaterThan(1);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
    expect(result.current.messages[0].content).toContain('Chat cleared');
  });
});
