import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-change-goods-random',
  templateUrl: './change-goods-random.component.html',
  styles: [],
})
export class ChangeGoodsRandomComponent implements OnInit {
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
      random: [null, Validators.required],
      noBien: [null, Validators.required],
      description: [null, Validators.required],
      transference: [null, Validators.required],
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
