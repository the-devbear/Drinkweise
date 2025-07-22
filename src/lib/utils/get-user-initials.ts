export function getUserInitials(username: string): string {
  const names = username.split(' ');

  if (names.length === 1) {
    return username.slice(0, 2).toUpperCase();
  }

  const initials = names.map((name) => name.charAt(0).toUpperCase()).join('');
  return initials.length > 2 ? initials.slice(0, 2) : initials;
}
