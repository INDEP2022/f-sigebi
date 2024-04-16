import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PROVIDER_CATALOGS_CLIENT_COLUMNS } from '../provider-catalogs-main/provider-catalogs-columns';
import { ProviderCatalogsModalComponent } from '../provider-catalogs-modal/provider-catalogs-modal.component';
import { SearchBarFilter } from './../../../../../common/repository/interfaces/search-bar-filters';

@Component({
  selector: 'app-clients-modal',
  templateUrl: './clients-modal.component.html',
  styles: [],
})
export class ClientsModalComponent extends BasePage implements OnInit {
  title: string = 'Clientes';
  params = new BehaviorSubject<ListParams>(new ListParams());
  searchFilter: SearchBarFilter;
  @Output() onSelect = new EventEmitter<any>();
  selectedRow: IComerClients | null = null;
  totalItems: number = 0;
  clientColumns: IComerClients[] = [];
  clientSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private clientsService: ComerClientsService
  ) {
    super();
    this.clientSettings.columns = PROVIDER_CATALOGS_CLIENT_COLUMNS;
    this.clientSettings.hideSubHeader = false;
    this.searchFilter = { field: 'reasonName' };
  }

  ngOnInit(): void {
    this.data
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
              case 'reasonName':
                searchFilter = SearchFilter.ILIKE;
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

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData(): void {
    const params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    this.clientsService.getAllWithFilters(params).subscribe({
      next: response => {
        this.clientColumns = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.clientColumns = [];
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
      },
    });
  }

  select(row: IComerClients[]): void {
    this.selectedRow = row[0];
  }

  close(): void {
    this.modalRef.hide();
  }

  confirm(): void {
    this.openModalProvider({
      provider: {
        nameReason: this.selectedRow.reasonName,
        rfc: this.selectedRow.rfc,
        curp: this.selectedRow.curp,
        street: this.selectedRow.street,
        colony: this.selectedRow.colony,
        delegation: this.selectedRow.delegation,
        stateDesc: null,
        cityDesc: null,
        clkmun: null,
        clkedo: null,
        clkCountry: null,
        cp: this.selectedRow.zipCode,
        phone: this.selectedRow.phone,
        fax: this.selectedRow.fax,
        typePerson: '1',
        webMail: this.selectedRow.mailWeb,
        customerId: this.selectedRow.id,
      },
    });
  }

  handleSuccess(): void {
    this.loading = true;
    this.loading = false;
    this.onSelect.emit(this.selectedRow);
    this.modalRef.hide();
  }

  openModalProvider(context?: Partial<ProviderCatalogsModalComponent>) {
    const modalRef = this.modalService.show(ProviderCatalogsModalComponent, {
      initialState: { ...context },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.handleSuccess();
    });
  }
}
