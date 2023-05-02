import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { BILLING_FOLIO_COLUMNS } from './folio-columns';

@Component({
  selector: 'app-folio-modal',
  templateUrl: './folio-modal.component.html',
  styles: [],
})
export class FolioModalComponent extends BasePage implements OnInit {
  title: string = 'Folios Apartados';
  selectedRows: any[] = [];
  @Output() onSelected = new EventEmitter<any>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  folioColumns: any[] = [];
  folioSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  folioTestData = [
    {
      series: 'SN',
      folio: 4943,
      reserve: 'S',
      userRegister: 'JMEJIA',
      registerDate: '30/09/2021',
    },
    {
      series: 'SU',
      folio: 4944,
      reserve: 'S',
      userRegister: 'KRIVERA',
      registerDate: '30/09/2021',
    },
    {
      series: 'TL',
      folio: 4945,
      reserve: 'S',
      userRegister: 'VGOMEZ',
      registerDate: '30/09/2021',
    },
    {
      series: 'VL',
      folio: 4946,
      reserve: 'S',
      userRegister: 'PTORRES',
      registerDate: '30/09/2021',
    },
  ];

  constructor(private modalRef: BsModalRef) {
    super();
    this.folioSettings.columns = BILLING_FOLIO_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.folioColumns = this.folioTestData;
    this.totalItems = this.folioColumns.length;
  }

  select(rows: any[]) {
    this.selectedRows = rows;
    console.log(this.selectedRows);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onSelected.emit(this.selectedRows[0]);
    this.modalRef.hide();
  }
}
