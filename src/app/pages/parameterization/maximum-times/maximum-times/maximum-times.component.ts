import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-maximum-times',
  templateUrl: './maximum-times.component.html',
  styles: [],
})
export class MaximumTimesComponent implements OnInit {
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
