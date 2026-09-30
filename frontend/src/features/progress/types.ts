export interface ProgressDayPoint {
  date: string;
  goals: { daily: number; weekly: number; monthly: number };
  tasks: number;
}

export interface ProgressResponse {
  days: ProgressDayPoint[];
}
