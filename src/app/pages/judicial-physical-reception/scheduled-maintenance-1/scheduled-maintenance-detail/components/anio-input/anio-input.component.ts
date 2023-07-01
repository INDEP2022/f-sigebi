import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-anio-input',
  templateUrl: './anio-input.component.html',
  styleUrls: ['./anio-input.component.css'],
})
export class AnioInputComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      anio: [null],
    });
    if (this.cell.newValue !== '') {
      this.form.controls['anio'].setValue(this.cell.newValue);
    }
  }

  updateData() {
    this.cell.newValue = this.form.controls['anio'].value;
  }
}
