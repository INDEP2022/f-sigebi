import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SAT_PAPERWORK_MAILBOX_COLUMNS,
  SAT_TRANSFER_COLUMNS,
} from './sat-subjects-register-columns';

@Component({
  selector: 'app-dr-sat-subjects-register',
  templateUrl: './dr-sat-subjects-register.component.html',
  styles: [],
})
export class DrSatSubjectsRegisterComponent implements OnInit {
  satForm: FormGroup;
  mailboxSettings = { ...TABLE_SETTINGS };
  transfersSettings = { ...TABLE_SETTINGS };
  cordinators = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    this.mailboxSettings.columns = SAT_PAPERWORK_MAILBOX_COLUMNS;
    this.transfersSettings.columns = SAT_TRANSFER_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.satForm = this.fb.group({
      from: [null],
      to: [null],
      asunto: [null],
      cordinador: [null],
      document: [null],
      status: [null],
      cve: [null],
      master: [null],
      house: [null],
      expediente: [null],
    });
  }
}
