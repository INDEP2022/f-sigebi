import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  invalidClass(control: AbstractControl | null): string {
    return this.isInvalid(control) ? 'form-danger' : 'form-secondary';
  }

  isInvalid(control: AbstractControl | null): boolean {
    return control.invalid && (control.touched || control.dirty) ? true : false;
  }

  handleError(control: AbstractControl | null): string {
    let errorCode: string;
    let meta: any;
    let msg: string = 'El campo es inválido';
    if (control) {
      if (control.errors) {
        errorCode = Object.keys(control.errors)[0];
        meta = Object.values(control.errors)[0];
        if (errorCode) {
          Object.keys(ERROR_MESSAGES).forEach(key => {
            if (key == errorCode) {
              msg = ERROR_MESSAGES[errorCode](meta);
            }
          });
        }
      }
    }
    return msg;
  }

  setControlError(
    control: AbstractControl | null,
    errorName: string,
    meta?: any
  ) {
    if (control) control.setErrors({ [errorName]: meta ? meta : true });
  }

  handleServerErrors(serverErrors: string[], formGroup: FormGroup) {
    serverErrors.forEach(error => {
      this.getFieldAndCode(error, formGroup);
    });
  }

  getFieldAndCode(error: string, formGroup: FormGroup) {
    const fieldError: string[] = error.split('.', 3);

    if (fieldError.length === 2 || fieldError.length === 3) {
      const control = fieldError[0];

      const form = formGroup.get([control]) as FormArray;
      if (form.controls && fieldError.length >= 4) {
        this.validateFormArray(fieldError, formGroup, form);
      } else {
        this.validateForm(fieldError, formGroup, control);
      }
    }
  }

  validateForm(fieldError: string[], formGroup: FormGroup, control: string) {
    const errorCode = fieldError[1];
    const meta = fieldError[2];
    let metaFormatted = null;
    if (errorCode === 'minlength' || errorCode === 'maxlength') {
      metaFormatted = { requiredLength: meta };
    }
    formGroup.markAllAsTouched();
    if (formGroup.get([control])) {
      this.setControlError(formGroup.get(control), errorCode, metaFormatted);
    }
  }

  validateFormArray(
    fieldError: string[],
    formGroup: FormGroup,
    form: FormArray
  ) {
    const i = Number(fieldError[1]);
    const subField = fieldError[2];
    const errorCode = fieldError[3];
    const meta = fieldError[4];
    let metaFormatted = null;
    if (errorCode === 'minlength' || errorCode === 'maxlength') {
      metaFormatted = { requiredLength: meta };
    }
    formGroup.markAllAsTouched();
    const formCtrl = form.controls[i];
    if (formCtrl.get(subField)) {
      this.setControlError(formCtrl.get(subField), errorCode, metaFormatted);
    }
  }

  minLengthArray(min: number) {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length >= min) return null;
      return { minLengthArray: { valid: false } };
    };
  }
}
