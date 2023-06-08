import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-mes-input',
  templateUrl: './mes-input.component.html',
  styleUrls: ['./mes-input.component.css'],
})
export class MesInputComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      mes: [null],
    });
    if (this.cell.newValue !== '') {
      this.form.controls['mes'].setValue(this.cell.newValue);
    }
  }

  updateData() {
    this.cell.newValue = this.form.controls['mes'].value;
  }
}
