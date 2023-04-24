import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delete-period',
  templateUrl: './delete-period.component.html',
  styles: [],
})
export class DeletePeriodComponent {
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    delegation: new FormControl(null, Validators.required),
    process: new FormControl(null, Validators.required),
  });

  public delegations = new DefaultSelect();
  // public procesess = new DefaultSelect();
  processes = [
    { id: 1, name: 'Supervisión' },
    { id: 2, name: 'Validación' },
  ];

  isLoading = false;
  @Output() eventDelete = new EventEmitter();

  constructor() {}

  onClickDeletePeriod() {
    this.eventDelete.emit(this.form.value);
  }

  getFormDeletePeriod() {
    return this.form;
  }
}
