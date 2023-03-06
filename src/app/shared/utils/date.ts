export function firstFormatDate(value: Date) {
  let year = value.getFullYear();
  let month = value.getMonth() + 1;
  let day = value.getDate();
  return `${year}-${month}-${day}`;
}

export function formatForIsoDateDatetime(value: string) {
  return value.substring(0, value.indexOf('.')).replace('T', ' ');
}

export function formatForIsoDate(value: string) {
  return value.substring(0, value.indexOf('T'));
}
