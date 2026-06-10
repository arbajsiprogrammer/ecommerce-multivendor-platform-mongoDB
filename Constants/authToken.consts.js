export const ACCESS_TOKEN_NAME = "access-token";

export const REFRESH_TOKEN_NAME = "refresh-token";

export const ACCESS_TOKEN_EXPIRY = "10m";

export const REFRESH_TOKEN_EXPIRY = "7d";

export const ACCESS_TOKEN_EXPIRY_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 1000 * 60 * 10, // 10 minutes
};

export const REFRESH_TOKEN_EXPIRY_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
