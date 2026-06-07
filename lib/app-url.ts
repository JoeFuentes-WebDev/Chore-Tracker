export function getAppUrl() {
    const url = process.env.APP_URL;
    if (!url) {
      throw new Error("APP_URL is not configured");
    }
    return url;
  }