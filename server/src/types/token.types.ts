export interface UserInfo {
  userId: string;
  name: string;
  isAdmin: boolean;
  roles: Role[];
}

type Role = "ADMIN" | "USER";
