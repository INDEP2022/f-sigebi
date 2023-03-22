import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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

  constructor(private fb: FormBuilder) {}

  deleteInServer() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  // public getDelegations(event: any) {
  //   // this.bankService.getAll(params).subscribe(data => {
  //   //   this.banks = new DefaultSelect(data.data, data.count);
  //   // });
  // }

  // public getProcesess(event: any) {
  //   // this.bankService.getAll(params).subscribe(data => {
  //   //   this.banks = new DefaultSelect(data.data, data.count);
  //   // });
  // }
}
