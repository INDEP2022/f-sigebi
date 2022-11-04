import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PROVIDER_CATALOGS_CLIENT_COLUMNS } from '../c-c-c-provider-catalogs-main/c-c-provider-catalogs-columns';

@Component({
  selector: 'app-c-c-c-clients-modal',
  templateUrl: './c-c-c-clients-modal.component.html',
  styles: [],
})
export class CCCClientsModalComponent extends BasePage implements OnInit {
  title: string = 'Clientes';
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onSelect = new EventEmitter<any>();
  selectedRows: any[] = [];
  totalItems: number = 0;
  clientColumns: any[] = [];
  clientSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  clientTestData = [
    {
      name: 'NOMBRE CLIENTE EJEMPLO 1',
      rfc: 'G17LONA6481EN',
    },
    {
      name: 'NOMBRE CLIENTE EJEMPLO 2',
      rfc: 'HERH51901WSH',
    },
    {
      name: 'NOMBRE CLIENTE EJEMPLO 3',
      rfc: '92RHJJFDSZ7',
    },
    {
      name: 'NOMBRE CLIENTE EJEMPLO 4',
      rfc: 'HDHJ9821KGSWA',
    },
    {
      name: 'NOMBRE CLIENTE EJEMPLO 5',
      rfc: 'KL919ULGSDDK3',
    },
  ];

  constructor(private modalRef: BsModalRef) {
    super();
    this.clientSettings.columns = PROVIDER_CATALOGS_CLIENT_COLUMNS;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.clientColumns = this.clientTestData;
    this.totalItems = this.clientColumns.length;
  }

  select(row: any[]) {
    this.selectedRows = row;
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
    this.onSelect.emit(this.selectedRows[0]);
    this.modalRef.hide();
  }
}
