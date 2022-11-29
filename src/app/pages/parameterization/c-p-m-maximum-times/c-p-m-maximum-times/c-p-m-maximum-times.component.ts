import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-p-m-maximum-times',
  templateUrl: './c-p-m-maximum-times.component.html',
  styles: [],
})
export class CPMMaximumTimesComponent implements OnInit {
  maximumTimesForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maximumTimesForm = this.fb.group({
      type: [null, [Validators.required]],
      term: [null, [Validators.required]],
      activate: [null, [Validators.required]],
      user: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }
}
