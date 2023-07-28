import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-programings',
  templateUrl: './maintenance-programings.component.html',
  styleUrls: ['./maintenance-programings.component.scss'],
})
export class MaintenanceProgramingsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  idDisabled = true;
  disabledDates = true;
  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      typePrograming: [null, Validators.required],
      id: [null, Validators.required],
      fechaInicio: [null],
      fechaFin: [null],
      newFechaInicio: [null, Validators.required],
      newFechaFin: [null, Validators.required],
      txtMotivoCambio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.form
      .get('typePrograming')
      .valueChanges.pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.idDisabled = false;
          } else {
            this.idDisabled = true;
          }
        },
      });
  }

  ngOnInit() {}

  consultDates() {}

  clear() {
    this.form.reset();
  }
}
