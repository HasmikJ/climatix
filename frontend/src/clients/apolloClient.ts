import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL ?? ""
  // headers: {
  // TODO: Add auth headers here, e.g. Authorization: `Bearer ${token}`

  /**
   *
   *
   * Where to store access tokens?
   *
   * Avoid: localStorage and sessionStorage — because they’re vulnerable to XSS attacks. Malicious scripts can steal tokens here.
   * Better: In-memory storage (React Context, Redux, or component state) —
   * tokens live only in memory, so they’re safer from XSS but lost on page reload.
   *
   * How to handle In-memory storage case?
   * Flow:
   * User logs in:
   * 1. Backend sends:
   *    - Short-lived access token (e.g., JWT) — stored in memory (e.g. in React Context).
   *    - Long-lived refresh token — stored as HTTP-only cookie (not accessible by JavaScript).
   * 2. API calls:
   *    - Send access token in Authorization header -  e.g. Authorization: `Bearer ${token}
   * 3. When access token expires or on reload:
   *    - React app detects expiry or missing token.
   *    - Sends request (with cookies automatically attached) to backend refresh endpoint.
   * 4. Backend verifies refresh token cookie, returns new access token.
   * 5. App updates access token in memory.
   */

  // },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
