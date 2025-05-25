export interface ChatMessage {
  type: 'message' | 'info';
  user?: string; 
  text: string;
  timestamp: string;
  id?: string; 
}

export interface OutgoingMessage {
  type: 'newMessage' | 'userJoined';
  user: string;
  text?: string; 
}