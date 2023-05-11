import { AbstractControl, ValidatorFn } from '@angular/forms';
import { startOfDay } from 'date-fns';

function minDate(min: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: { min: any } } | null => {
    const _minDate = startOfDay(control.value);
    const dateControl = startOfDay(min);
    if (_minDate < dateControl) {
      return { minDate: { min } };
    }
    return null;
  };
}

function maxDate(max: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: { max: any } } | null => {
    const _maxDate = startOfDay(control.value);
    const dateControl = startOfDay(max);
    if (_maxDate > dateControl) {
      return { maxDate: { max } };
    }
    return null;
  };
}

function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDate = control.get('startDate').value;
    const endDate = control.get('endDate').value;

    if (endDate && startDate) {
      return startDate <= endDate ? null : { dateRange: true };
    }

    return null;
  };
}
function getErrorMessage(fin: string, ini: string) {
  const stard = new Date(ini).getTime();
  const end = new Date(fin).getTime();
  if (fin && ini) {
    return stard <= end
      ? null
      : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
  }
  return '';
}

export { minDate, maxDate, dateRangeValidator, getErrorMessage };
