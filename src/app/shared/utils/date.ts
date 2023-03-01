export function firstFormatDate(value: Date) {
  let year = value.getFullYear();
  let month = value.getMonth() + 1;
  let day = value.getDate();
  return `${year}-${month}-${day}`;
}
