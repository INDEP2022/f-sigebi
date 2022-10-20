import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-supervision',
  templateUrl: './supervision.component.html',
  styles: [],
})
export class SupervisionComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      state: [null, Validators.required],
      supervisors: [null, Validators.required],
      zone: [null, Validators.required],
      inmueble: [null, Validators.required],
      cost: [null],
      total: [null],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
