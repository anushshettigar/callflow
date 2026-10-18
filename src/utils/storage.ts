import type { CallRecord, Task, CalendarEvent, ChatMessage, User } from '../types';

const STORAGE_KEYS = {
  CALL_RECORDS: 'callflow_call_records',
  TASKS: 'callflow_tasks',
  CALENDAR_EVENTS: 'callflow_calendar_events',
  CHAT_MESSAGES: 'callflow_chat_messages',
  USER_PREFERENCES: 'callflow_user_preferences',
  RECENT_LEADS: 'callflow_recent_leads',
  CALL_OUTCOMES: 'callflow_call_outcomes'
} as const;

export const getStoredCallRecords = (): CallRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALL_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredCallRecords = (records: CallRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CALL_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to store call records:', error);
  }
};

export const addCallRecord = (record: CallRecord): void => {
  const records = getStoredCallRecords();
  records.unshift(record);
  setStoredCallRecords(records);
};

export const updateCallRecord = (id: string, updates: Partial<CallRecord>): void => {
  const records = getStoredCallRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    setStoredCallRecords(records);
  }
};

export const getStoredTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to store tasks:', error);
  }
};

export const addTask = (task: Task): void => {
  const tasks = getStoredTasks();
  tasks.unshift(task);
  setStoredTasks(tasks);
};

export const updateTask = (id: string, updates: Partial<Task>): void => {
  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    setStoredTasks(tasks);
  }
};

export const deleteTask = (id: string): void => {
  const tasks = getStoredTasks();
  const filtered = tasks.filter(t => t.id !== id);
  setStoredTasks(filtered);
};

export const getStoredCalendarEvents = (): CalendarEvent[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredCalendarEvents = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to store calendar events:', error);
  }
};

export const addCalendarEvent = (event: CalendarEvent): void => {
  const events = getStoredCalendarEvents();
  events.push(event);
  setStoredCalendarEvents(events);
};

export const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>): void => {
  const events = getStoredCalendarEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    setStoredCalendarEvents(events);
  }
};

export const deleteCalendarEvent = (id: string): void => {
  const events = getStoredCalendarEvents();
  const filtered = events.filter(e => e.id !== id);
  setStoredCalendarEvents(filtered);
};

export const getStoredChatMessages = (channelId: string): ChatMessage[] => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${channelId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setStoredChatMessages = (channelId: string, messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${channelId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to store chat messages:', error);
  }
};

export const addChatMessage = (channelId: string, message: ChatMessage): void => {
  const messages = getStoredChatMessages(channelId);
  messages.push(message);
  setStoredChatMessages(channelId, messages);
};

export const getUserPreferences = (): User['preferences'] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : {
      theme: 'system',
      notifications: true,
      autoDial: false
    };
  } catch {
    return {
      theme: 'system',
      notifications: true,
      autoDial: false
    };
  }
};

export const setUserPreferences = (preferences: User['preferences']): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to store user preferences:', error);
  }
};

export const getRecentLeads = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_LEADS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentLead = (leadId: string): void => {
  const leads = getRecentLeads();
  const filtered = leads.filter(id => id !== leadId);
  filtered.unshift(leadId);
  const trimmed = filtered.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT_LEADS, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to store recent leads:', error);
  }
};

export const getCallOutcomes = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CALL_OUTCOMES);
    return data ? JSON.parse(data) : [
      'Qualified - demo scheduled',
      'Proposal delivered',
      'Negotiation started',
      'Closed-won',
      'Closed-lost',
      'Follow-up scheduled',
      'Not interested',
      'Wrong number',
      'Voicemail left',
      'Callback requested'
    ];
  } catch {
    return [];
  }
};

export const addCallOutcome = (outcome: string): void => {
  const outcomes = getCallOutcomes();
  if (!outcomes.includes(outcome)) {
    outcomes.unshift(outcome);
    const trimmed = outcomes.slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEYS.CALL_OUTCOMES, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to store call outcome:', error);
    }
  }
};

export const clearAllStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};