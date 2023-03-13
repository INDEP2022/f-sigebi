import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { CustomersModalComponent } from '../customers-modal/customers-modal.component';
import { RepresentativesModalComponent } from '../representatives-modal/representatives-modal.component';
//Columns
import { CUSTOMERS_COLUMNS } from './customers-columns';
import { REPRESENTATIVES_COLUMNS } from './representatives-columns';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
//Services
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { MassiveClientService } from 'src/app/core/services/ms-massiveclient/massiveclient.service';
import {
  ERROR_INTERNET,
  NOT_FOUND_MESSAGE,
} from 'src/app/pages/documents-reception/subjects-register/utils/pgr-subjects-register.messages';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styles: [],
})
export class CustomersListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  customers: ICustomer[] = [];
  representative: IRepresentative[] = [];

  client: ICustomer;

  settings2;

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  show: boolean = false;

  data: LocalDataSource = new LocalDataSource();

  downloading: boolean = false;

  constructor(
    private modalService: BsModalService,
    private customerService: CustomerService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private massiveClientService: MassiveClientService
  ) {
    super();
    this.searchFilter = { field: 'reasonName', operator: SearchFilter.ILIKE };

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

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },

      columns: { ...REPRESENTATIVES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.show = true;
    this.filterParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
  }

  //Table de todos los clientes
  getCustomers(): void {
    if (this.show) this.filterParams.getValue().removeAllFilters();
    this.loading = true;
    this.customerService
      .getAllClients(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.show = false;
          this.customers = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.representative = [];
    this.client = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRepresentativebyClients(this.client));
  }

  //Tabla de representates
  getRepresentativebyClients(client?: ICustomer) {
    console.log('datos del cliente', client.agentId);
    this.loading = true;
    this.customerService
      .getRepresentativeByClients(client.agentId, this.params2.getValue())
      .pipe(
        map((data2: any) => {
          let list: IListResponse<IRepresentative> =
            {} as IListResponse<IRepresentative>;
          const array2: IRepresentative[] = [{ ...data2 }];
          list.data = array2;
          return list;
        })
      )
      .subscribe({
        next: response => {
          let data = response.data.map((item: IRepresentative) => {
            let data = item.dateBorn;
            item.dateBorn = this.datePipe.transform(data, 'dd/MM/yyyy');
            return item;
          });
          this.data.load(data);
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
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

  openFormClients(customers?: ICustomer) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      customers,
      callback: (next: boolean) => {
        if (next) this.getCustomers();
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

  //Exportar representates
  exportAllRepresentative(): void {
    // this.excelService.exportAsExcelFile(
    //   this.representative,
    //   'Todos los representantes'
    // );
    this.massiveClientService.exportAgents().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.file.base64) {
          this.downloadFile(
            data.file.base64,
            `representantes${new Date().getTime()}`
          );
        } else {
          this.onLoadToast(
            'warning',
            '',
            NOT_FOUND_MESSAGE('Exporta representates')
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

  openFormRepresentative(representative?: IRepresentative) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      representative,
      callback: (next: boolean) => {
        if (next) this.getRepresentativebyClients();
      },
    };
    this.modalService.show(RepresentativesModalComponent, modalConfig);
  }
}
