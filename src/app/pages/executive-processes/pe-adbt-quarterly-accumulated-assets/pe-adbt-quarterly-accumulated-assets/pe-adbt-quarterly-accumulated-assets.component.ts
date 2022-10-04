import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-adbt-quarterly-accumulated-assets',
  templateUrl: './pe-adbt-quarterly-accumulated-assets.component.html',
  styles: [
  ]
})
export class PeAdbtQuarterlyAccumulatedAssetsComponent implements OnInit {
  form: FormGroup = new FormGroup({}); 
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      fromMonth: ['', [Validators.required]],
      toMonth: ['', [Validators.required]],
    });
  }

}
