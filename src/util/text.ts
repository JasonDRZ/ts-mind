export const text = {
  is_empty(s: any) {
    if (!s) {
      return true;
    }
    return s.replace(/\s*/, "").length === 0;
  }
};
