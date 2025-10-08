export function getUserInitials(username: string): string {
  const names = username
    .trim()
    .split(' ')
    .filter((name) => name.length > 0);

  if (names.length === 1) {
    return username.slice(0, 2).toUpperCase();
  }

  const initials = names.map((name) => name.charAt(0).toUpperCase()).join('');
  return initials.length > 2 ? initials.slice(0, 2) : initials;
}
