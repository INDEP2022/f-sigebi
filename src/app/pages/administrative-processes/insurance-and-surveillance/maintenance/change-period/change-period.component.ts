import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-change-period',
  templateUrl: './change-period.component.html',
  styles: [],
})
export class ChangePeriodComponent {
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    delegation: new FormControl(null, Validators.required),
    process: new FormControl(null, Validators.required),
    yearDestiny: new FormControl(null, Validators.required),
    periodDestiny: new FormControl(null, Validators.required),
    delegationDestiny: new FormControl(null, Validators.required),
    processDestiny: new FormControl(null, Validators.required),
  });

  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  public procesess1 = new DefaultSelect(this.processes, 2);

  // public delegations = new DefaultSelect();
  isLoading = false;
  @Output() eventChangePeriod = new EventEmitter();

  constructor() {}

  // ngOnInit(): void {
  //   this.prepareForm();
  // }

  // prepareForm() {
  //   this.form = this.fb.group({
  //     year: [null, Validators.required],
  //     period: [null, Validators.required],
  //     delegation: [null, Validators.required],
  //     process: [null, Validators.required],
  //     yearDestiny: [null, Validators.required],
  //     periodDestiny: [null, Validators.required],
  //     delegationDestiny: [null, Validators.required],
  //     processDestiny: [null, Validators.required],
  //   });
  // }

  getFormChangePeriod() {
    return this.form;
  }

  changePeriod() {
    console.log(this.form.value);
    this.eventChangePeriod.emit(this.form.value);
  }

  public getDelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getProcesess(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  cleanForm() {
    this.form.reset();
  }
}
