import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
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
  searchFilter: SearchBarFilter;
  totalItems: number = 0;
  selectedProvider: IComerProvider | null = null;
  providerColumns: IComerProvider[] = [];
  providerSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
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
    this.prepareForm();
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
            console.log('Antes switch');
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

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      providerId: [null],
      bank: [null, Validators.maxLength(30)],
      branch: [null, Validators.maxLength(6)],
      checkingCta: [null, Validators.maxLength(20)],
      key: [null, Validators.maxLength(20)],
    });

    this.providerForm.disable();
  }

  getData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    this.providerService.getAllWithFilters(params).subscribe({
      next: response => {
        this.providerColumns = response.data;
        this.data.load(this.providerColumns);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.providerColumns = [];
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  selectProvider(provider: IComerProvider) {
    console.log('selectProvider', provider);
    this.isSelected = true;
    this.providerForm.patchValue(provider);
    this.selectedProvider = provider;
    this.providerForm.enable();
    this.providerForm.get('providerId').disable();
  }

  openFormProvider(edit: boolean, provider?: IComerProvider) {
    this.isSelected = false;
    this.providerForm.reset();
    this.openModalProvider({ provider, edit });
  }

  openModalProvider(context?: Partial<ProviderCatalogsModalComponent>) {
    const modalRef = this.modalService.show(ProviderCatalogsModalComponent, {
      initialState: { ...context },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data)
        this.getData(), this.providerForm.disable(), this.providerForm.reset();
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
      if (data)
        this.getData(), this.providerForm.disable(), this.providerForm.reset();
    });
  }

  delete(provider: IComerProvider): void {
    this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar este registro?'
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
    let item = {
      providerId: this.selectedProvider.providerId,
      nameReason: this.selectedProvider.nameReason,
      rfc: this.selectedProvider.rfc,
      street: this.selectedProvider.street,
      clkedo: this.selectedProvider.clkedo,
      colony: this.selectedProvider.colony,
      clkmun: this.selectedProvider.clkmun,
      cityDesc: this.selectedProvider.cityDesc,
      clkCountry: this.selectedProvider.clkCountry,
      stateDesc: this.selectedProvider.stateDesc,
      delegation: this.selectedProvider.delegation,
      fax: this.selectedProvider.fax,
      commission: this.selectedProvider.commission,
      phone: this.selectedProvider.phone,
      curp: this.selectedProvider.curp,
      typePerson: this.selectedProvider.typePerson,
      preponderantAct: this.selectedProvider.preponderantAct,
      cp: this.selectedProvider.cp,
      contractNo: this.selectedProvider.contractNo,
      esCustomer: this.selectedProvider.esCustomer,
      bank: this.selectedProvider.bank,
      branch: this.selectedProvider.branch,
      checkingCta: this.selectedProvider.checkingCta,
      key: this.selectedProvider.key,
      userCreation: this.selectedProvider.userCreation,
      formPayment: this.selectedProvider.formPayment,
      webMail: this.selectedProvider.webMail,
      customerId: this.selectedProvider.customerId,
      references: this.selectedProvider.references,
    };
    this.providerService
      .update(this.selectedProvider.providerId, item)
      .subscribe({
        next: resp => {
          this.getData();
          this.alert('success', 'Registro actualizado correctamente', '');
          this.isSelected = false;
          this.providerForm.disable(), this.providerForm.reset();
        },
        error: error => {
          this.alert('error', 'No se pudo actualizar el registro', '');
          this.loading = false;
        },
      });
  }
}
