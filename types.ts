
export enum GamePhase {
  WELCOME = 'welcome',
  WHAT_IF = 'what_if',
  MEMORY_CHALLENGE = 'memory_challenge',
  IF_I_WERE_YOU = 'if_i_were_you',
  FINALE = 'finale'
}

export interface Message {
  role: 'host' | 'user';
  text: string;
  timestamp: Date;
}

export interface GameState {
  messages: Message[];
  phase: GamePhase;
  isLoading: boolean;
}
