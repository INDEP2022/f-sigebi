import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TESOFE_MOVEMENTS_COLUMNS } from './tesofe-movements-columns';

@Component({
  selector: 'app-tesofe-movements',
  templateUrl: './tesofe-movements.component.html',
  styles: [],
})
export class TesofeMovementsComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TESOFE_MOVEMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      account: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
