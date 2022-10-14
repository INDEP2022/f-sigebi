import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dr-goods-forecast',
  templateUrl: './dr-goods-forecast.component.html',
  styles: [],
})
export class DrGoodsForecastComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      prevision: [false, [Validators.required]],
      observaciones: [null, [Validators.required]],
    });
  }
}
