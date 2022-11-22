import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposit-unreconcilied-files',
  templateUrl: './deposit-unreconcilied-files.component.html',
  styles: [],
})
export class DepositUnreconciliedFilesComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, Validators.required],

      currency: [null, Validators.required],

      date: [null, Validators.required],
      dateTo: [null, Validators.required],

      searchImport: [null, Validators.required],
    });
  }
}
