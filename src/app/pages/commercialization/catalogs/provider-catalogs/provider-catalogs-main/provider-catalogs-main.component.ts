import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SearchBarFilter } from '../../../../../common/repository/interfaces/search-bar-filters';
import { IComerProvider } from '../../../../../core/models/ms-provider/provider-model';
import { ComerProvidersService } from '../../../../../core/services/ms-provider/comer-providers.service';
import { ClientsModalComponent } from '../clients-modal/clients-modal.component';
import { ProviderCatalogsModalComponent } from '../provider-catalogs-modal/provider-catalogs-modal.component';
import { PROVIDER_CATALOGS_PROVIDER_COLUMNS } from './provider-catalogs-columns';

@Component({
  selector: 'app-provider-catalogs-main',
  templateUrl: './provider-catalogs-main.component.html',
  styles: [],
})
export class ProviderCatalogsMainComponent extends BasePage implements OnInit {
  providerForm: FormGroup = new FormGroup({});
  providerItems = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  totalItems: number = 0;
  selectedProvider: IComerProvider | null = null;
  providerColumns: IComerProvider[] = [];
  providerSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      edit: true,
      delete: true,
    },
  };
  isSelected: boolean = false;

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private providerService: ComerProvidersService
  ) {
    super();
    this.providerSettings.columns = PROVIDER_CATALOGS_PROVIDER_COLUMNS;
    this.searchFilter = { field: 'nameReason', operator: SearchFilter.ILIKE };
    this.providerSettings = {
      ...this.providerSettings,
      hideSubHeader: false,
    };
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
            /*  SPECIFIC CASES*/
            switch (filter.field) {
              case 'providerId':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });

    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
    this.prepareForm();
    this.getProviders();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      providerId: [null],
      bank: [null, Validators.maxLength(20)],
      branch: [null, Validators.maxLength(4)],
      checkingCta: [null, Validators.maxLength(10)],
      key: [null, Validators.maxLength(18)],
    });

    this.providerForm.disable();
  }

  getProviders() {
    this.providerService.getAll(this.params.getValue()).subscribe(data => {
      this.providerItems = new DefaultSelect(data.data, data.count);
    });
  }

  getData(id?: IComerProvider) {
    if (id) {
      this.loading = true;
      this.providerService.getById(id.providerId).subscribe({
        next: response => {
          this.providerColumns = [response];
          this.data.load(this.providerColumns);
          this.totalItems = 1;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
    } else {
      this.loading = true;
      this.providerService
        .getAllWithFilters(this.filterParams.getValue().getParams())
        .subscribe({
          next: response => {
            this.providerColumns = response.data;
            this.data.load(this.providerColumns);
            this.totalItems = response.count;
            this.loading = false;
          },
          error: error => {
            this.showError(error);
            this.loading = false;
          },
        });
    }
  }

  selectProvider(provider: IComerProvider) {
    this.isSelected = true;
    this.providerForm.patchValue(provider);
    this.selectedProvider = provider;
    this.providerForm.enable();
  }

  openFormProvider(edit: boolean, provider?: IComerProvider) {
    this.isSelected = false;
    this.providerForm.reset();
    this.openModalProvider({ provider, edit });
  }

  openModalProvider(context?: Partial<ProviderCatalogsModalComponent>) {
    const modalRef = this.modalService.show(ProviderCatalogsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.getData();
    });
  }

  openClientsModal() {
    this.isSelected = false;
    this.providerForm.reset();
    const modalRef = this.modalService.show(ClientsModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe((data: boolean) => {
      if (data) this.getData();
    });
  }

  delete(provider: IComerProvider): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.providerService.remove(provider.providerId).subscribe({
          next: () => {
            this.loading = false;
            this.showSuccess();
            this.getData();
          },
          error: error => {
            this.loading = false;
            this.showError(error);
          },
        });
      }
    });
  }

  showSuccess() {
    this.onLoadToast(
      'success',
      'Proveedor',
      `Registro Eliminado Correctamente`
    );
  }

  showError(error?: any) {
    this.onLoadToast('error', error.error.message, '');
  }

  saveBank() {
    this.selectedProvider = {
      ...this.selectedProvider,
      ...this.providerForm.value,
    };
    delete this.selectedProvider.customer;
    const provider = { ...this.selectedProvider };
    this.providerService
      .update(this.selectedProvider.providerId, provider)
      .subscribe({
        next: resp => {
          this.getData(), this.onLoadToast('success', resp.message, '');
          this.isSelected = false;
          this.providerForm.reset();
        },
        error: error => {
          this.showError(error);
          this.loading = false;
        },
      });

    console.log(this.selectedProvider);
  }
}
