import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-adbt-annual-accumulated-assets',
  templateUrl: './pe-adbt-annual-accumulated-assets.component.html',
  styles: [
  ]
})
export class PeAdbtAnnualAccumulatedAssetsComponent implements OnInit {
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
    });
  }

}
