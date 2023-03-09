import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-actions',
  templateUrl: './view-actions.component.html',
  styles: [],
})
export class ViewActionsComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      good: [null],
    });
  }

  ngOnInit(): void {}
}
