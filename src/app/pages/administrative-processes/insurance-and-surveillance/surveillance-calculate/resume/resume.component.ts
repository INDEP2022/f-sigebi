import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styles: [],
})
export class ResumeComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      order: [null, Validators.required],
      amount: [null, Validators.required],
      iva: [null, Validators.required],
      total: [null, Validators.required],
      importe: [null],
      ivaa: [null],
      totals: [null],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
