export function firstFormatDate(value: Date) {
  if (value) {
    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
}

export function formatForIsoDateDatetime(value: string) {
  return value
    ? value.substring(0, value.indexOf('.')).replace('T', ' ')
    : null;
}

export function formatForIsoDate(
  value: string,
  format: 'string' | 'date' = 'date'
) {
  const newValue = value ? value.substring(0, value.indexOf('T')) : null;
  if (newValue === null) return null;
  return format === 'string' ? newValue : new Date(newValue);
}
