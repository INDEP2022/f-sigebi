import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { RepresentativesModalComponent } from '../../representatives-modal/representatives-modal.component';
import { REPRESENTATIVES_COLUMNS } from '../representatives-columns';
import { CustomersExportRepresentantsListComponent } from './customers-export-representants-list/customers-export-representants-list.component';

@Component({
  selector: 'app-customers-representants-list',
  templateUrl: './customers-representants-list.component.html',
  styles: [
    `
      @media screen and (max-width: 767px) {
        .ch-content {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class CustomersRepresentantsListComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  private _client: ICustomer;
  @Input() get client(): ICustomer {
    return this._client;
  }
  set client(value: ICustomer) {
    this._client = value;
    this.getData();
  }

  downloading: boolean = false;
  override columnFilters: any = [];
  override data: LocalDataSource = new LocalDataSource();
  agentId: number;
  constructor(
    private modalService: BsModalService,
    private customerService: CustomerService
  ) {
    super();
    this.settings.columns = REPRESENTATIVES_COLUMNS;
    this.service = this.customerService;
    this.settings.hideSubHeader = false;
    this.settings.actions.columnTitle = 'Acciones';
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
    this.settings.actions.position = 'right';
    this.ilikeFilters = ['fax', 'state', 'city', 'street', 'autEmiIndentify'];
  }

  override getData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.client) {
      if (!this.client.agentId) {
        this.loading = false;
        this.data = new LocalDataSource();
        this.totalItems = 0;
        this.alert('warning', 'Cliente no Tiene Representante Asociado', '');
        return;
      }
      this.agentId = this.client.agentId.id;
      this.loading = true;
      this.customerService
        .getRepresentativeByClients(this.agentId, params)
        .subscribe({
          next: response => {
            this.data.load([response]);
            this.data.refresh();
            this.totalItems = 1;
            this.loading = false;
          },
          error: error => {
            this.loading = false;
            this.data = new LocalDataSource();
            this.totalItems = 0;
            this.alert(
              'error',
              'No es Posible Traer al Representante Asociado',
              ''
            );
          },
        });
    }
  }

  //Exportar representates
  exportAllRepresentative() {
    if (!this.client) {
      this.alert(
        'warning',
        'Selecciona Primero un Cliente Para Exportar su Representante',
        ''
      );
    } else {
      const agentId = this.client.agentId.id;
      const modalConfig = MODAL_CONFIG;
      modalConfig.initialState = {
        agentId,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      };
      this.modalService.show(
        CustomersExportRepresentantsListComponent,
        modalConfig
      );
    }
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
    this.alert('error', 'Hubo un Error al Exportar Representates', '');
  }

  openFormRepresentative(representative?: IRepresentative) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      representative,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(RepresentativesModalComponent, modalConfig);
  }
}
