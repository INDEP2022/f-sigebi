import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-query-interconnection-form',
  templateUrl: './query-interconnection-form.component.html',
  styles: [],
})
export class QueryInterconnectionFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, [Validators.required]],
    });
  }
}
