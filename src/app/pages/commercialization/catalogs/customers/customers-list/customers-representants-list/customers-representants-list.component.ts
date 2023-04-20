import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';
import { IRepresentative } from 'src/app/core/models/catalogs/representative-model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { MassiveClientService } from 'src/app/core/services/ms-massiveclient/massiveclient.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import {
  ERROR_INTERNET,
  NOT_FOUND_MESSAGE,
} from 'src/app/pages/documents-reception/subjects-register/utils/pgr-subjects-register.messages';
import { RepresentativesModalComponent } from '../../representatives-modal/representatives-modal.component';
import { REPRESENTATIVES_COLUMNS } from '../representatives-columns';

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
  constructor(
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private customerService: CustomerService,
    private massiveClientService: MassiveClientService
  ) {
    super();
    this.service = this.customerService;
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...REPRESENTATIVES_COLUMNS },
    };
    this.ilikeFilters = ['fax', 'state', 'city', 'street', 'autEmiIndentify'];
  }

  override getData() {
    if (this.client) {
      if (!this.client.agentId) {
        this.onLoadToast(
          'warning',
          'Cliente no tiene representante asociado',
          ''
        );
        return;
      }
      console.log(this.client);
      this.loading = true;
      this.customerService
        .getRepresentativeByClients(this.client.agentId)
        .subscribe({
          next: response => {
            console.log(response);
            // let data = response.data.map((item: IRepresentative) => {
            //   let data = item.dateBorn;
            //   item.dateBorn = this.datePipe.transform(data, 'dd/MM/yyyy');
            //   return item;
            // });
            this.data.load(response.data);
            this.totalItems = 1;
            this.loading = false;
          },
          error: error => {
            this.data.load([]);
            this.totalItems = 0;
            this.loading = false;
          },
        });
    }
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
