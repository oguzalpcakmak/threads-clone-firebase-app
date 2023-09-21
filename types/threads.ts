import { TimeData } from "../utils/time-ago";

export interface Thread {
  id: string;
  uid: string;
  author: User;
  content: string;
  image?: string;
  replies?: Reply[];
  likes?: User[];
  mention?: boolean;
  mentionUser: User;
  timestamp: TimeData;
  isShown: boolean;
}

export interface Reply {
  id: string;
  author: User;
  content: string;
  likes?: User[];
  createdAt: string;
}

export interface User {
  uid: string;
  displayName: string;
  username: string;
  verified: boolean;
  photoURL: string;
  bio: string;
  link?: string;
  followers?: User[];
}
