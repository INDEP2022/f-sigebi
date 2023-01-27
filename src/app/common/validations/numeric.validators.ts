import { AbstractControl, ValidatorFn } from '@angular/forms';
const numericRegExp = /^[0-9]+$/;
export const onlyNumbers = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null;
    return !numericRegExp.test(control.value) ? { numeric: true } : null;
  };
};
