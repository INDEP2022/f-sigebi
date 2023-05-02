import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-print-massive-account',
  templateUrl: './print-massive-account.component.html',
  styles: [],
})
export class PrintMassiveAccountComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],

      depositDate: [null, Validators.required],
      depositDateTo: [null, Validators.required],

      transferenceDate: [null, Validators.required],
      transferenceDateTo: [null, Validators.required],

      receptionDate: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
    });
  }
}
