export const dateFormatterWithoutYear = new Intl.DateTimeFormat('default', {
  day: '2-digit',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
