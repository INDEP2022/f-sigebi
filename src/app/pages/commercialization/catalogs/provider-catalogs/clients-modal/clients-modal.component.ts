import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FilterParams } from '../../../../../common/repository/interfaces/list-params';
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
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  @Output() onSelect = new EventEmitter<any>();
  selectedRow: IComerClients | null = null;
  totalItems: number = 0;
  clientColumns: IComerClients[] = [];
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

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private clientsService: ComerClientsService
  ) {
    super();
    this.clientSettings.columns = PROVIDER_CATALOGS_CLIENT_COLUMNS;
    this.searchFilter = { field: 'reasonName' };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
    // this.getData();
  }

  getData(): void {
    this.loading = true;
    this.clientsService
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.clientColumns = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
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
    // TODO: Obtener clkmun, clkedo y clkCountry

    this.openModalProvider({
      provider: {
        nameReason: this.selectedRow.reasonName,
        rfc: this.selectedRow.rfc,
        curp: this.selectedRow.curp,
        street: this.selectedRow.street,
        colony: this.selectedRow.colony,
        delegation: this.selectedRow.delegation,
        stateDesc: this.selectedRow.state,
        cityDesc: this.selectedRow.city,
        clkmun: '1',
        clkedo: String(this.selectedRow.stateId),
        clkCountry: null,
        cp: this.selectedRow.zipCode,
        phone: this.selectedRow.phone,
        fax: this.selectedRow.fax,
        typePerson: this.selectedRow.personType.includes('F') ? '1' : '2',
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
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.handleSuccess();
    });
  }
}
