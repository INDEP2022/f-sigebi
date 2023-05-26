export function firstFormatDate(value: Date) {
  if (value) {
    let year: any = value.getFullYear();
    if (year < 10) {
      year = '0' + year;
    }
    let month: any = value.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day: any = value.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
}

export function secondFormatDate(value: Date) {
  if (value) {
    let year: any = value.getFullYear();
    if (year < 10) {
      year = '0' + year;
    }
    let month: any = value.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day: any = value.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
}

export function firstFormatDateToSecondFormatDate(date: string) {
  if (date) {
    const array = date.split('/');
    return array[2] + '-' + array[1] + '-' + array[0];
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
  format: 'string' | 'date' = 'date',
  replaceText: string = '-'
) {
  const newValue = value ? value.substring(0, value.indexOf('T')) : null;
  if (newValue === null) return null;
  const values = newValue.split(replaceText);
  let mes: any = +values[1];
  if (mes < 10) {
    mes = '0' + mes;
  }
  return format === 'string'
    ? `${values[2]}/${mes}/${values[0]}`
    : new Date(+values[0], +mes - 1, +values[2]);
}
