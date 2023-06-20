import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_APPOINTMENT_ADMINISTRATIVE_PAYS } from './appointments-administrative-report.columns';

@Component({
  selector: 'app-appointments-administrative-report',
  templateUrl: './appointments-administrative-report.component.html',
  styles: [],
})
export class AppointmentsAdministrativeReportComponent
  extends BasePage
  implements OnInit
{
  settingsTable = { ...this.settings };
  dataTable: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  loadingTable: boolean = false;
  tableParams = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settingsTable = {
      ...this.settingsTable,
      actions: {
        edit: false,
        add: false,
        delete: false,
      },
      hideSubHeader: true,
      columns: { ...COLUMNS_APPOINTMENT_ADMINISTRATIVE_PAYS },
    };
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
