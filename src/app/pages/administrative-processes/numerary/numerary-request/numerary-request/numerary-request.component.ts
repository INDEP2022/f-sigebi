import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { REQUEST_NUMERARY_COLUMNS } from './numerary-request-columns';

@Component({
  selector: 'app-numerary-request',
  templateUrl: './numerary-request.component.html',
  styles: [],
})
export class NumeraryRequestComponent extends BasePage implements OnInit {
  form: FormGroup;
  registers = 155;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUEST_NUMERARY_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      idProcess: [null, Validators.required],
      date: [null, Validators.required],

      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      devolution: [null, Validators.required],
      decomiso: [null, Validators.required],
      abandono: [null, Validators.required],
      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
