import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styles: [],
})
export class ModalComponentComponent extends BasePage implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  op: number;
  data: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    console.log(this.op);
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      proceedings: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      good: [null, [Validators.required]],
      goodDescrip: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.form2 = this.fb.group({
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onSubmit() {}
}
