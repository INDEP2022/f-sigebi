import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-modal-select-requests',
  templateUrl: './modal-select-requests.component.html',
  styles: [],
})
export class ModalSelectRequestsComponent extends BasePage implements OnInit {
  op: number;
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    if (this.op === 1) {
      this.form = this.fb.group({
        idDonee: [null, [Validators.required]],
        numbWarehouse: [null, [Validators.required]],
        typeRequest: [
          null,
          [Validators.required, Validators.pattern(STRING_PATTERN)],
        ],
      });
    } else {
      this.form = this.fb.group({
        typeRequest: [null, [Validators.required]],
      });
    }
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onSubmit() {}
}
