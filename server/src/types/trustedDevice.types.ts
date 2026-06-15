export type CreateTrustedDevice = {
  userId: string;
  deviceToken: string;
  ipAddress: string | null;
  userAgent: string | null;
};
