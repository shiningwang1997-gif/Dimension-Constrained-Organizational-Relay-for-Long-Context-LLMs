export function idFromHash(): string {
  let id = "";
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    if (hash) {
      // 匹配 id=XXX 格式，XXX 可以是任何非&字符
      const match = hash.match(/[#&]id=([^&]*)/);
      if (match && match[1]) {
        id = decodeURIComponent(match[1]);
      }
    }
  }
  return id;
}

export function typeFromHash(): string {
  let type = "";
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    if (hash) {
      // 匹配 id=XXX 格式，XXX 可以是任何非&字符
      const match = hash.match(/[#&]type=([^&]*)/);
      if (match && match[1]) {
        type = decodeURIComponent(match[1]);
      }
    }
  }
  return type;
}
