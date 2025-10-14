export type AppContext = {
  Bindings: {
    DB: D1Database;
    R2: R2Bucket;
    AI: any;
    GEMINI_API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
  }
}
