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

export { minDate, maxDate };
