import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  PGR_PAPERWORK_MAILBOX_COLUMNS,
  PGR_TRANSFERS_COLUMNS,
} from './pgr-subject-register-columns';

@Component({
  selector: 'app-dr-pgr-subjects-register',
  templateUrl: './dr-pgr-subjects-register.component.html',
  styles: [],
})
export class DrPgrSubjectsRegisterComponent implements OnInit {
  satForm: FormGroup;
  mailboxSettings = { ...TABLE_SETTINGS };
  transfersSettings = { ...TABLE_SETTINGS };
  cordinators = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    this.mailboxSettings.columns = PGR_PAPERWORK_MAILBOX_COLUMNS;
    this.transfersSettings.columns = PGR_TRANSFERS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.satForm = this.fb.group({
      from: [null],
      to: [null],
      aver: [null],
      cordinador: [null],
      document: [null],
      status: [null],
      pgrGood: [null],
      saeGood: [null],
      saeStatus: [null],
    });
  }
}
