import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { WORK_MAILBOX_COLUMNS } from './work-mailbox-columns';

@Component({
  selector: 'app-gp-work-mailbox',
  templateUrl: './gp-work-mailbox.component.html',
  styles: [
    `
      form-check .form-control {
        padding-top: -15px !important;
        padding-bottom: -15px !important;
        margin-top: -15px !important;
        margin-bottom: -15px !important;
      }
    `,
  ],
})
export class GpWorkMailboxComponent extends BasePage implements OnInit {
  form = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null],
  });
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = WORK_MAILBOX_COLUMNS;
  }

  ngOnInit(): void {}
}
