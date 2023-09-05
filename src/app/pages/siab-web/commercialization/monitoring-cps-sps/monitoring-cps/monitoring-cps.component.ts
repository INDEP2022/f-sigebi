import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-monitoring-cps',
  templateUrl: './monitoring-cps.component.html',
  styles: [],
})
export class monitoringCpsComponent extends BasePage implements OnInit {
  //

  override minMode: BsDatepickerViewMode = 'year'; // change for month:year

  form: FormGroup;

  today: Date;
  maxDate: Date;
  minDate: Date;

  show: boolean = false;

  //

  constructor(private fb: FormBuilder) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
      }
    );
  }

  //

  private prepareForm() {
    this.form = this.fb.group({
      radioOne: [null],
      radioTwo: [null],
      from: [null],
      to: [null],
      year: [null],
      event: [null],
    });
  }

  data: any;
  data2: any;

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  //
}
