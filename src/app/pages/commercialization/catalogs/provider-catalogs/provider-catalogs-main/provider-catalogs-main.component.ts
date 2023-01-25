import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  getParams: ListParams;
  totalItems: number = 0;
  providerColumns: any[] = [];
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
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      let params: ListParams = { page: 1, limit: 10 };
      data.inicio = data.page;
      data.pageSize = data.limit;
      this.getParams = data;
      // console.log(data);
      // console.log(this.getParams);
      this.getData();
    });
    this.prepareForm();
    // this.getData();
    this.getProviders({ inicio: 1, text: '' });
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      id: [null],
    });
  }

  getProviders(params: ListParams) {
    // if (params.text == '') {
    //   this.providerItems = new DefaultSelect(this.providerTestData, 5);
    // } else {
    //   const id = parseInt(params.text);
    //   const item = [this.providerTestData.filter((i: any) => i.id == id)];
    //   this.providerItems = new DefaultSelect(item[0], 1);
    // }
    this.providerService.getAll(params).subscribe(data => {
      this.providerItems = new DefaultSelect(data.data, data.count);
    });
  }

  getData(id?: IComerProvider) {
    // if (id) {
    //   this.providerColumns = [this.providerTestData[0]];
    //   this.totalItems = this.providerColumns.length;
    // } else {
    //   this.providerColumns = this.providerTestData;
    //   this.totalItems = this.providerColumns.length;
    // }
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
      this.providerService.getAll(this.getParams).subscribe({
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

  openFormProvider(provider?: any) {
    this.openModalProvider({ provider });
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
}
