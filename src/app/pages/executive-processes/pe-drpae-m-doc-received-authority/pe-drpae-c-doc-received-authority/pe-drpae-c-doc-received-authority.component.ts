import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-drpae-c-doc-received-authority',
  templateUrl: './pe-drpae-c-doc-received-authority.component.html',
  styles: [],
})
export class PeDrpaeCDocReceivedAuthorityComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      rangeDate: ['', [Validators.required]],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]],
    });
  }
}
