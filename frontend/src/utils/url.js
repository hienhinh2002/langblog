// src/utils/url.js
export function getDomain(u) {
    try {
      const host = new URL(u).hostname;
      return host.replace(/^www\./i, "");
    } catch {
      return "";
    }
  }
  
  export function isHttpUrl(u) {
    try {
      const p = new URL(u).protocol;
      return p === "http:" || p === "https:";
    } catch {
      return false;
    }
  }
  