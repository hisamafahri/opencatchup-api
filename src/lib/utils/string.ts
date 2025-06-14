export const normalizeEmail = (email: string, prefix?: string) => {
  const normalized = email
    .toLowerCase()
    .replace(/\+/g, "_plus_")
    .replace(/\./g, "_dot_")
    .replace(/@/g, "_at_")
    .replace(/[^a-z0-9_]/g, ""); // keep only safe characters

  if (prefix) {
    return prefix + normalized;
  } else {
    return normalized;
  }
};
