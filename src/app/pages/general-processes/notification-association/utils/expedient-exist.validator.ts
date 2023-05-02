import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage, SweetalertModel } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
export class ExpedientValidator extends BasePage {
  static createValidator(expedientService: ExpedientService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      if (!control.value) {
        return of({ nonExist: null });
      }
      return expedientService.getById(control.value).pipe(
        catchError(error => {
          showError();
          control.setValue(null);
          return null;
        }),
        map(res => null)
      );
    };
  }
}

function showError() {
  let sweetalert = new SweetalertModel();
  sweetalert.toast = true;
  sweetalert.position = 'top-end';
  sweetalert.timer = 6000;
  sweetalert.title = 'Error';
  sweetalert.text = 'El expediente no existe';
  sweetalert.icon = 'error';
  Swal.fire(sweetalert);
}
