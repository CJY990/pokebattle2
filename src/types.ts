export interface Card {
  id: string;
  name: string;
  image: string;
  hp: number;
  attack: number;
  description: string;
  type?: string;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  hand: Card[];
  deck: Card[];
  field: Card | null; // 현재 낸 카드
}

export type GamePhase = 'start' | 'player-turn' | 'opponent-turn' | 'battle' | 'end';

export interface GameState {
  currentRound: number;
  maxRounds: number;
  player: PlayerState;
  opponent: PlayerState;
  phase: GamePhase;
  winner: 'player' | 'opponent' | 'draw' | null;
  logs: string[]; // 전투 로그
}
