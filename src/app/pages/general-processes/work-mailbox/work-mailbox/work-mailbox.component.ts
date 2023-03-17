import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { WorkMailboxService } from '../work-mailbox.service';
import { WORK_MAILBOX_COLUMNS } from './work-mailbox-columns';

@Component({
  selector: 'app-work-mailbox',
  templateUrl: './work-mailbox.component.html',
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
export class WorkMailboxComponent extends BasePage implements OnInit {
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [];

  form = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
  });
  constructor(
    private fb: FormBuilder,
    private workService: WorkMailboxService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = WORK_MAILBOX_COLUMNS;
  }

  ngOnInit(): void {
    this.workService.getView().subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              columname: item.royalProceesDate,
              columname2: item.naturalDays,
              columname3: item.processEntryDate,
              columname4: item.processStatus,
              columname5: item.flierNumber,
              columname6: item.userATurn,
              columname7: item.priority,
            });
          });

          this.dataTable.load(this.data);
        }
      },
    });
  }
}
