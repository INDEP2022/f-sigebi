import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import {
  ICustomersPenalties,
  IHistoryCustomersPenalties,
} from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { CustomersPenaltiesExportHistoricComponent } from '../../customer-penalties-export-historic/customer-penalties-export-historic.component';
import { COLUMNS2 } from '../columns';

@Component({
  selector: 'app-history-customers-penalties',
  templateUrl: './history-customers-penalties.component.html',
  styles: [],
})
export class HistoryCustomersPenaltiesComponent
  extends BasePage
  implements OnInit
{
  uno: any;
  customersPenalties: IHistoryCustomersPenalties[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data2: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  private _penalties: ICustomersPenalties;
  @Input() get penalties(): ICustomersPenalties {
    return this._penalties;
  }
  set penalties(value: ICustomersPenalties) {
    this._penalties = value;
    this.uno = this._penalties;
    this.getData();
  }
  downloading: boolean = false;
  clientId: number;

  constructor(
    private modalService: BsModalService,
    private clientPenaltyService: ClientPenaltyService,
    private excelService: ExcelService
  ) {
    super();
    this.settings.columns = COLUMNS2;
    this.settings.hideSubHeader = false;
    this.settings.actions.columnTitle = 'Acciones';
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
    this.settings.actions.position = 'right';
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  ngOnInit(): void {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'processType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'event':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'eventKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'batchId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'initialDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'finalDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'reasonPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'causefree':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrPenalize':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrfree':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'penalizesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'releasesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  rowsSelected(event: any) {
    const dat = event.data;
  }

  getData() {
    this.data2 = new LocalDataSource();
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.penalties) {
      this.clientId = this.penalties.clientId.id;
      this.loading = true;
      this.clientPenaltyService
        .getByIdComerPenaltyHis(this.clientId, params)
        .subscribe({
          next: response => {
            this.customersPenalties = response.data;
            this.data2.load(response.data);
            console.log(this.data2);
            this.data2.refresh();
            this.totalItems = response.data.length;
            console.log(this.totalItems);
            this.loading = false;
          },
          error: error => {
            this.loading = false;
            this.alert(
              'warning',
              'Cliente no Tiene un Histórico de Penalización',
              ''
            );
          },
        });
    }
  }

  openForm(iHistoryCustomersPenalties?: IHistoryCustomersPenalties) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      iHistoryCustomersPenalties,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(
      CustomersPenaltiesExportHistoricComponent,
      modalConfig
    );
  }

  all(): void {
    this.excelService.exportAsExcelFile(
      this.customersPenalties,
      'PenalizacionesDeCliente'
    );
  }
}
