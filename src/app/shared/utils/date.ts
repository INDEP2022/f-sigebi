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

export function thirdFormatDate(value: Date) {
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
    return `${year}${month}${day}`;
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

export function firstFormatDateToSecondFormatDatetime(date: string) {
  if (date) {
    const array = date.split(' ');

    return array[2] + '-' + array[1] + '-' + array[0] + '';
  } else {
    return null;
  }
}

export function firstFormatDateToDate(date: string) {
  if (date) {
    const array = date.split('/');
    return new Date(+array[2], +array[1], +array[0]);
    // return array[2] + '-' + array[1] + '-' + array[0];
  } else {
    return null;
  }
}

export function secondFormatDateToDate(date: string) {
  if (date) {
    const array = date.split('-');
    return new Date(+array[0], +array[1], +array[2]);
  } else {
    return null;
  }
}

export function secondFormatDateTofirstFormatDate(date: string) {
  if (date) {
    const array = date.split('-');
    return array[2] + '/' + array[1] + '/' + array[0];
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
  widthTime: boolean = false,
  replaceText: string = '-'
) {
  if (!value) return null;
  const position = value.indexOf('T');
  // console.log(position);
  const newValue = value
    ? position > 0
      ? value.substring(0, position)
      : value
    : null;
  if (newValue === null) return null;
  const values = newValue.split(replaceText);
  const values2 = value.substring(position + 1, value.length).split(':');
  let mes: any = +values[1];
  if (mes < 10) {
    mes = '0' + mes;
  }
  return format === 'string'
    ? `${values[2]}/${mes}/${values[0]}` +
        (widthTime
          ? ` ${values2[0]}:${values2[1]}:${values2[2].substring(0, 2)}`
          : '')
    : new Date(+values[0], +mes - 1, +values[2]);
}
