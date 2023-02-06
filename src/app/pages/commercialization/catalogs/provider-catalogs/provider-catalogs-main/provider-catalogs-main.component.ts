import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SearchFilter } from '../../../../../common/repository/interfaces/list-params';
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
      position: 'left',
      add: true,
      edit: true,
      delete: true,
    },
  };

  providerTestData = [
    {
      id: 1,
      rfc: 'SRHSR6616SHRH',
      curp: 'EJEMPLO CURP',
      name: 'NOMBRE EJEMPLO PROVEEDOR 1',
      street: 'Calle Ejemplo',
      neighborhood: 'Colonia Ejemplo',
      delegation: 'Delegacion Ejemplo',
      state: 'Estado Ejemplo',
      city: 'Ciudad Ejemplo',
      country: 'Pais Ejemplo',
      cp: 'Ejemplo CP',
      phone: '+52 111 111 1111',
      fax: '111111111111',
      email: 'correoejemplo@gmail.com',
      type: 'A',
      activity: 'Actividad de Ejemplo',
      contractNumber: '11111111',
    },
    {
      id: 2,
      rfc: 'SEGS681JHDJFKDS7',
      curp: 'EJEMPLO CURP',
      name: 'NOMBRE EJEMPLO PROVEEDOR 2',
      street: 'Calle Ejemplo',
      neighborhood: 'Colonia Ejemplo',
      delegation: 'Delegacion Ejemplo',
      state: 'Estado Ejemplo',
      city: 'Ciudad Ejemplo',
      country: 'Pais Ejemplo',
      cp: 'Ejemplo CP',
      phone: '+52 111 111 1111',
      fax: '111111111111',
      email: 'correoejemplo@gmail.com',
      type: 'A',
      activity: 'Actividad de Ejemplo',
      contractNumber: '11111111',
    },
    {
      id: 3,
      rfc: '18RSGHRSHHASD1',
      curp: 'EJEMPLO CURP',
      name: 'NOMBRE EJEMPLO PROVEEDOR 3',
      street: 'Calle Ejemplo',
      neighborhood: 'Colonia Ejemplo',
      delegation: 'Delegacion Ejemplo',
      state: 'Estado Ejemplo',
      city: 'Ciudad Ejemplo',
      country: 'Pais Ejemplo',
      cp: 'Ejemplo CP',
      phone: '+52 111 111 1111',
      fax: '111111111111',
      email: 'correoejemplo@gmail.com',
      type: 'A',
      activity: 'Actividad de Ejemplo',
      contractNumber: '11111111',
    },
    {
      id: 4,
      rfc: 'SHSRH8189A3EK',
      curp: 'EJEMPLO CURP',
      name: 'NOMBRE EJEMPLO PROVEEDOR 4',
      street: 'Calle Ejemplo',
      neighborhood: 'Colonia Ejemplo',
      delegation: 'Delegacion Ejemplo',
      state: 'Estado Ejemplo',
      city: 'Ciudad Ejemplo',
      country: 'Pais Ejemplo',
      cp: 'Ejemplo CP',
      phone: '+52 111 111 1111',
      fax: '111111111111',
      email: 'correoejemplo@gmail.com',
      type: 'A',
      activity: 'Actividad de Ejemplo',
      contractNumber: '11111111',
    },
    {
      id: 5,
      rfc: 'HJDTJD9219JDAW',
      curp: 'EJEMPLO CURP',
      name: 'NOMBRE EJEMPLO PROVEEDOR 5',
      street: 'Calle Ejemplo',
      neighborhood: 'Colonia Ejemplo',
      delegation: 'Delegacion Ejemplo',
      state: 'Estado Ejemplo',
      city: 'Ciudad Ejemplo',
      country: 'Pais Ejemplo',
      cp: 'Ejemplo CP',
      phone: '+52 111 111 1111',
      fax: '111111111111',
      email: 'correoejemplo@gmail.com',
      type: 'A',
      activity: 'Actividad de Ejemplo',
      contractNumber: '11111111',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private providerService: ComerProvidersService
  ) {
    super();
    this.providerSettings.columns = PROVIDER_CATALOGS_PROVIDER_COLUMNS;
    this.searchFilter = { field: 'nameReason', operator: SearchFilter.IN };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
    this.prepareForm();
    this.getProviders({ inicio: 1, text: '' });
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      providerId: [null],
      bank: [null],
      branch: [null],
      checkingCta: [null],
      key: [null],
    });
  }

  getProviders(params: ListParams) {
    this.providerService.getAll(params).subscribe(data => {
      this.providerItems = new DefaultSelect(data.data, data.count);
    });
  }

  getData(id?: IComerProvider) {
    if (id) {
      this.loading = true;
      this.providerService.getById(id.providerId).subscribe({
        next: response => {
          this.providerColumns = [response];
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
            this.totalItems = response.count;
            this.loading = false;
          },
          error: error => {
            this.loading = false;
            console.log(error);
          },
        });
    }
  }

  selectProvider(provider: IComerProvider) {
    this.providerForm.patchValue(provider);
    this.selectedProvider = provider;
  }

  openFormProvider(provider?: IComerProvider) {
    this.openModalProvider({ provider, edit: true });
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
    const modalRef = this.modalService.show(ClientsModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe((data: boolean) => {
      if (data) console.log(data);
    });
  }

  delete(provider: IComerProvider): void {
    this.loading = true;
    this.providerService.remove(provider.providerId).subscribe({
      next: data => {
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

  showSuccess() {
    this.onLoadToast(
      'success',
      'Proveedor',
      `Registro Eliminado Correctamente`
    );
  }

  showError(error?: any) {
    this.onLoadToast(
      'error',
      `Error al eliminar datos`,
      'Hubo un problema al conectarse con el servior'
    );
    error ? console.log(error) : null;
  }
}
