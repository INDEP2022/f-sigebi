import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_COMER_LOTES } from './columns-comer-lotes';

@Component({
  selector: 'app-comer-lotes-table',
  templateUrl: './comer-lotes-table.html',
  styleUrls: ['./comer-lotes-table.component.css'],
})
export class ComerLotesTableComponent extends BasePage implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },*/
      columns: { ...COLUMNS_COMER_LOTES },
    };
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }
}
