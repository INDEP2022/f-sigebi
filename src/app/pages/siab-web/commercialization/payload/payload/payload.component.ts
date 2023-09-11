import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DATA_COLUMNS } from './columns';

@Component({
  selector: 'app-payload',
  templateUrl: './payload.component.html',
  styles: [],
})
export class PayloadComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DATA_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  rowSelect(event: any) {}

  data: any;
}
