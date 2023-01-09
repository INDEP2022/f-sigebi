import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-numerary-historical-closing',
  templateUrl: './numerary-historical-closing.component.html',
  styles: [],
})
export class NumeraryHistoricalClosingComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      dateReport: [null, Validators.required],
    });
  }
}
