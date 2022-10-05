import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-drpae-c-doc-received-authority',
  templateUrl: './pe-drpae-c-doc-received-authority.component.html',
  styles: [
  ]
})
export class PeDrpaeCDocReceivedAuthorityComponent implements OnInit {

  form : FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subDelegation: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
    })
  }

}
