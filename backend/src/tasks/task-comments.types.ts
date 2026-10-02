export interface TaskCommentAuthor {
  id: string;
  name: string;
}

export interface TaskCommentResponse {
  id: string;
  taskId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: TaskCommentAuthor;
}
