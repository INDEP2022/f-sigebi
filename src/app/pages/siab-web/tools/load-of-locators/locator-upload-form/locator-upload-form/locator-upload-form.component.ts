import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-locator-upload-form',
  templateUrl: './locator-upload-form.component.html',
  styles: [],
})
export class LocatorUploadFormComponent extends BasePage implements OnInit {
  regionalDelegations = new DefaultSelect<any>();
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      regionalDelegation: [null, [Validators.required]],
      file: [null, [Validators.required]],
    });
  }
  getRegionalDelegationSelect(event: ListParams) {
    console.log(event);
  }

  cancel() {}

  confirm() {}
}
