import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SUPERVISION_COLUMNS } from './supervision-columns';

@Component({
  selector: 'app-supervision',
  templateUrl: './supervision.component.html',
  styles: [],
})
export class SupervisionComponent extends BasePage implements OnInit {
  form: FormGroup;
  supervisions: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = SUPERVISION_COLUMNS;
  }

  ngOnInit(): void {
    // this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      state: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      supervisors: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      zone: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      inmueble: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      cost: [null],
      total: [null],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
