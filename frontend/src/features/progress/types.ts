export interface ProgressDayPoint {
  date: string;
  projects: number;
  tasks: number;
}

export interface ProgressResponse {
  days: ProgressDayPoint[];
}
