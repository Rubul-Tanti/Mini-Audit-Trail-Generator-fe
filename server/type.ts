export interface AuditRecord {
  _id: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  text: string;
  timestamp: string; // or Date if you want Date type
  __v: number;
}

export type getHistoryresponce= AuditRecord[]