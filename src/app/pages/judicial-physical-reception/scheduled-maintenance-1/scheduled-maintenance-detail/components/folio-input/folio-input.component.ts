import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-folio-input',
  templateUrl: './folio-input.component.html',
  styleUrls: ['./folio-input.component.css'],
})
export class FolioInputComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      folio: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.cell.newValue !== '') {
      this.form.controls['folio'].setValue(this.cell.newValue);
    }
  }

  updateData() {
    this.cell.newValue = this.form.controls['folio'].value;
  }
}
