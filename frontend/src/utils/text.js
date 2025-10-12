// loại toàn bộ thẻ HTML và trả về text thuần
export const htmlToText = (html = "") => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  };
  
  // cắt ngắn chuỗi có dấu …
  export const truncate = (s = "", max = 180) =>
    s.length > max ? s.slice(0, max).trim() + "…" : s;
  