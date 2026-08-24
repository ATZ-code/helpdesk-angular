export interface Ticket {

  id: string;

  title: string;

  description: string;

  priority:
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent';

  status:
    | 'open'
    | 'in_progress'
    | 'resolved'
    | 'closed';

  createdBy: string;

  assignedTo: string | null;

  createdAt: string;

  updatedAt: string;

}


export interface TicketResponse {

  data: Ticket[];

  meta: {

    total: number;

    page: number;

    limit: number;

    totalPages: number;

  };

}

export interface CommentAuthor {
  id: string;
  name: string;
  role: 'admin' | 'agent' | 'client';
}

export interface TicketComment {
  id: string;
  ticketId: string;
  body: string;
  author: CommentAuthor;
  createdAt: string;
}

export interface CommentsResponse {
  data: TicketComment[];
  total: number;
}

export interface CreateCommentResponse {
  data: TicketComment;
}