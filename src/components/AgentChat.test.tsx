import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { AgentChat } from './AgentChat';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// FAB button
// ---------------------------------------------------------------------------

describe('AgentChat – FAB button', () => {
  it('renders the FAB button with correct aria-label', () => {
    render(<AgentChat />);

    const fab = screen.getByRole('button', { name: /open ai assistant/i });
    expect(fab).toBeInTheDocument();
  });

  it('does not show the chat panel initially', () => {
    render(<AgentChat />);

    // The agent-panel should not be in the DOM
    expect(screen.queryByText(/Regulatory AI Agent/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Opening / closing the panel
// ---------------------------------------------------------------------------

describe('AgentChat – open / close panel', () => {
  it('clicking the FAB opens the chat panel', () => {
    render(<AgentChat />);

    const fab = screen.getByRole('button', { name: /open ai assistant/i });
    fireClick(fab);

    expect(screen.getByText(/Regulatory AI Agent/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask about regulations/i)).toBeInTheDocument();
  });

  it('shows the welcome message when chat panel opens', () => {
    render(<AgentChat />);

    const fab = screen.getByRole('button', { name: /open ai assistant/i });
    fireClick(fab);

    // The welcome message should be visible (rendered as HTML via dangerouslySetInnerHTML)
    expect(screen.getByText(/Regulatory AI Assistant/)).toBeInTheDocument();
  });

  it('closing the panel hides it', () => {
    render(<AgentChat />);

    // Open
    const fabOpen = screen.getByRole('button', { name: /open ai assistant/i });
    fireClick(fabOpen);
    expect(screen.getByText(/Regulatory AI Agent/)).toBeInTheDocument();

    // Close
    const fabClose = screen.getByRole('button', { name: /close ai assistant/i });
    fireClick(fabClose);
    expect(screen.queryByText(/Regulatory AI Agent/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// User input and submission
// ---------------------------------------------------------------------------

describe('AgentChat – user interaction', () => {
  it('user can type into the input field', () => {
    render(<AgentChat />);
    openChat();

    const input = screen.getByPlaceholderText(/ask about regulations/i);
    fireChange(input, 'hello');

    expect(input).toHaveValue('hello');
  });

  it('submitting a message shows the user message in the chat', () => {
    render(<AgentChat />);
    openChat();

    submitMessage('How many regulations?');

    // The user message text should appear in the DOM
    expect(screen.getByText('How many regulations?')).toBeInTheDocument();
  });

  it('input is cleared after submission', () => {
    render(<AgentChat />);
    openChat();

    submitMessage('help');

    const input = screen.getByPlaceholderText(/ask about regulations/i);
    expect(input).toHaveValue('');
  });

  it('empty input does not submit', () => {
    render(<AgentChat />);
    openChat();

    const form = screen.getByPlaceholderText(/ask about regulations/i).closest('form')!;
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // Should still have only the welcome message (no user message added)
    // The agent-msg elements: only 1 (welcome)
    const msgBubbles = document.querySelectorAll('.agent-msg');
    expect(msgBubbles).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------

describe('AgentChat – typing indicator', () => {
  it('shows typing indicator while loading', () => {
    render(<AgentChat />);
    openChat();

    // Submit a message but do NOT advance timers
    submitMessage('help');

    // Typing indicator dots should be visible
    const dots = document.querySelectorAll('.agent-typing .dot');
    expect(dots.length).toBe(3);
  });

  it('hides typing indicator after response arrives', () => {
    render(<AgentChat />);
    openChat();

    submitMessage('help');

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const dots = document.querySelectorAll('.agent-typing .dot');
    expect(dots.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Clear chat
// ---------------------------------------------------------------------------

describe('AgentChat – clear button', () => {
  it('clicking the clear button resets the chat', () => {
    render(<AgentChat />);
    openChat();

    // Send a message so we have conversation history
    submitMessage('help');
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // There should be 3 messages: welcome + user + assistant
    let msgBubbles = document.querySelectorAll('.agent-msg');
    expect(msgBubbles.length).toBe(3);

    // Click clear
    const clearBtn = screen.getByTitle('Clear chat');
    fireClick(clearBtn);

    // After clearing, only the new welcome message should remain
    msgBubbles = document.querySelectorAll('.agent-msg');
    expect(msgBubbles.length).toBe(1);
    expect(screen.getByText(/Chat cleared/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Send button disabled state
// ---------------------------------------------------------------------------

describe('AgentChat – send button state', () => {
  it('send button is disabled when input is empty', () => {
    render(<AgentChat />);
    openChat();

    const sendBtn = screen.getByRole('button', { name: '' });
    // There are two buttons without text in the panel: clear and send.
    // The submit button is of type="submit".
    const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();
  });

  it('send button is disabled while loading', () => {
    render(<AgentChat />);
    openChat();

    submitMessage('hello');

    const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Click a button synchronously (works with fake timers, unlike userEvent). */
function fireClick(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

/** Set an input's value synchronously. */
function fireChange(element: Element, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )!.set!;
  act(() => {
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

/** Open the chat panel by clicking the FAB. */
function openChat() {
  const fab = screen.getByRole('button', { name: /open ai assistant/i });
  fireClick(fab);
}

/** Type a message and submit the form. */
function submitMessage(text: string) {
  const input = screen.getByPlaceholderText(/ask about regulations/i);
  fireChange(input, text);

  const form = input.closest('form')!;
  act(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}
