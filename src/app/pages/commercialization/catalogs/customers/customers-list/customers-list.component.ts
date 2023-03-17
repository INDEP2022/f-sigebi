import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
//Components
import { CustomersModalComponent } from '../customers-modal/customers-modal.component';
//Columns
import { CUSTOMERS_COLUMNS } from './customers-columns';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
//Services
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { MassiveClientService } from 'src/app/core/services/ms-massiveclient/massiveclient.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import {
  ERROR_INTERNET,
  NOT_FOUND_MESSAGE,
} from 'src/app/pages/documents-reception/subjects-register/utils/pgr-subjects-register.messages';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styles: [],
})
export class CustomersListComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  customers: ICustomer[] = [];
  representative: IRepresentative[] = [];

  client: ICustomer;
  show: boolean = false;

  downloading: boolean = false;

  constructor(
    private modalService: BsModalService,
    private customerService: CustomerService,
    private massiveClientService: MassiveClientService
  ) {
    super();
    this.service = this.customerService;
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...CUSTOMERS_COLUMNS },
    };
    this.ilikeFilters = [
      'fax',
      'state',
      'city',
      'street',
      'colony',
      'phone',
      'mailWeb',
      'paternalSurname',
      'maternalSurname',
    ];
    // this.ilikeFilters = ['reasonName', 'street'];
    this.show = true;
  }

  //Table de todos los clientes
  rowsSelected(event: any) {
    this.client = event.data;
  }

  //Exportar todos los clientes
  exportAllClients(): void {
    this.massiveClientService.exportAllClients().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.file.base64) {
          this.downloadFile(
            data.file.base64,
            `TotalClientes${new Date().getTime()}`
          );
        } else {
          this.onLoadToast(
            'warning',
            '',
            NOT_FOUND_MESSAGE('Exporta todos los Clientes')
          );
        }
        this.downloading = false;
      },
      error: error => {
        this.downloading = false;
        this.errorGet(error);
      },
    });

    // this.excelService.exportAsExcelFile(this.customers, 'Todos los clientes');
  }

  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.target = '_blank';
    downloadLink.click();
    downloadLink.remove();
  }

  errorGet(err: any) {
    this.onLoadToast(
      'error',
      'Error',
      err.status === 0 ? ERROR_INTERNET : err.error.message
    );
  }

  openFormClients(customers?: any) {
    const modalConfig = MODAL_CONFIG;
    console.log(customers);
    if (customers) {
      customers = { ...customers, sellerId: customers.sellerId?.id ?? null };
    }

    modalConfig.initialState = {
      customers,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(CustomersModalComponent, modalConfig);
  }

  //Abrir modal de lista negra
  openBlackList() {
    /*const modalConfig = MODAL_CONFIG;
    this.modalService.show(CustomersBlackListComponent, modalConfig);*/
    this.massiveClientService.exportBlackList().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.file.base64) {
          this.downloadFile(
            data.file.base64,
            `listanegra${new Date().getTime()}`
          );
        } else {
          this.onLoadToast('warning', '', NOT_FOUND_MESSAGE('Listanegra'));
        }
        this.downloading = false;
      },
      error: error => {
        this.downloading = false;
        this.errorGet(error);
      },
    });
  }

  //Abrir modal de lista blanca
  openWhiteList() {
    /*const modalConfig = MODAL_CONFIG;
    this.modalService.show(CustomersWhiteListComponent, modalConfig);*/
    this.massiveClientService.exportwoutProblem().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.file.base64) {
          this.downloadFile(
            data.file.base64,
            `Sinproblema${new Date().getTime()}`
          );
        } else {
          this.onLoadToast(
            'warning',
            '',
            NOT_FOUND_MESSAGE('Exporta sin problema')
          );
        }
        this.downloading = false;
      },
      error: error => {
        this.downloading = false;
        this.errorGet(error);
      },
    });
  }
}
