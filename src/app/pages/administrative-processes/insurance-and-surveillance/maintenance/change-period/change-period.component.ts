import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-change-period',
  templateUrl: './change-period.component.html',
  styles: [],
})
export class ChangePeriodComponent implements OnInit {
  form: FormGroup;

  public delegations = new DefaultSelect();
  public procesess = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      year: [null, Validators.required],
      period: [null, Validators.required],
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      yearDestiny: [null, Validators.required],
      periodDestiny: [null, Validators.required],
      delegationDestiny: [null, Validators.required],
      processDestiny: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
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
}
