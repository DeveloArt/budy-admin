export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target?: string;
  timestamp: string;
}
