import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tracker-form',
  templateUrl: './tracker-form.component.html',
  styles: [],
})
export class TrackerFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      numberGood: [null],
      keyUniqueSat: [null],
      expedient: [null],
      fileUpload: [null],
      description: [null],
      assetClassificationNumber: [null],
      minute: [null],
      noCourt: [null],
    });
  }
}
