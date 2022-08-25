
interface NewMessageRequest {
  file?: string;
  text: string;
  $clientId?: string;
  uid: string;
  timestamp: number;
  channel: string;
}

interface NewMessageResponse {
  uid: string;
  from: string;
  text: string;
  timestamp: number;
  channel: string;
  file?: {
    url: string;
    type: string;
  }
}

interface RecentMessagesResponse {
  channel: string;
}

interface RecentMessagesResponse {
  messages: {
    uid: string;
    from: string;
    text: string;
    timestamp: number;
  }[];
  channel: string;
}