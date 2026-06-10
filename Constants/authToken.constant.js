const ACCESS_TOKEN_NAME = "access-token";

const REFRESH_TOKEN_NAME = "refresh-token";

const ACCESS_TOKEN_EXPIRY = "1m";

const REFRESH_TOKEN_EXPIRY = "7d";

const ACCESS_TOKEN_EXPIRY_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 1000 * 60, // 10 minutes
};

const REFRESH_TOKEN_EXPIRY_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

export {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY_OPTIONS,
  REFRESH_TOKEN_EXPIRY_OPTIONS,
};

// {}6a2952849b621b47b750bd1e
