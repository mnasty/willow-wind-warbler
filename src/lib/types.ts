import type { UserInfo } from "firebase/auth";

export interface Newsletter {
  id: string;
  name: string;
  url: string;
  date: Date;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  providerData: UserInfo[];
}
