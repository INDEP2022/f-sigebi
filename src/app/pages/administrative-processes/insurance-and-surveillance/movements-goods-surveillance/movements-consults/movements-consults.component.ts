import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { MOVEMENTS_COSULTS_COLUMNS } from './movements-consults-columns';

@Component({
  selector: 'app-movements-consults',
  templateUrl: './movements-consults.component.html',
  styles: [],
})
export class MovementsConsultsComponent extends BasePage implements OnInit {
  form: FormGroup;

  consults: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = MOVEMENTS_COSULTS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cveContract: [
        null,
        Validators.required,
        Validators.pattern(KEYGENERATION_PATTERN),
      ],
      radio: [null, Validators.required],
      h24: [null, Validators.required],
      h12: [null, Validators.required],
      indirectTurn: [null, Validators.required],
      canineTurn: [null, Validators.required],
      criteria: [null, Validators.required],
      descCriteria: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
}
