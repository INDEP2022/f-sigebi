import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SAT_PAPERWORK_MAILBOX_COLUMNS,
  SAT_TRANSFER_COLUMNS,
} from './sat-subjects-register-columns';

@Component({
  selector: 'app-sat-subjects-register',
  templateUrl: './sat-subjects-register.component.html',
  styles: [],
})
export class SatSubjectsRegisterComponent extends BasePage implements OnInit {
  satForm: FormGroup;
  mailboxSettings = {
    ...this.settings,
    columns: SAT_PAPERWORK_MAILBOX_COLUMNS,
  };
  transfersSettings = { ...this.settings, columns: SAT_TRANSFER_COLUMNS };
  cordinators = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.satForm = this.fb.group({
      from: [null],
      to: [null],
      asunto: [null, Validators.pattern(STRING_PATTERN)],
      cordinador: [null],
      document: [null, Validators.pattern(STRING_PATTERN)],
      status: [null, Validators.pattern(STRING_PATTERN)],
      cve: [null, Validators.pattern(KEYGENERATION_PATTERN)],
      master: [null, Validators.pattern(STRING_PATTERN)],
      house: [null, Validators.pattern(STRING_PATTERN)],
      expediente: [null],
    });
  }
}
