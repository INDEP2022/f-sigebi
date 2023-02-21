import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITiieV1 } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegistrationOfInterestModalComponent } from './registration-of-interest-modal/registration-of-interest-modal.component';
@Component({
  selector: 'app-registration-of-interest',
  templateUrl: './registration-of-interest.component.html',
  styleUrls: ['registration-of-interest.component.scss'],
})
export class RegistrationOfInterestComponent
  extends BasePage
  implements OnInit
{
  catObject: ITiieV1;
  cats: ITiieV1[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings1 = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      position: 'right',
    },
    columns: {
      tipo: {
        title: 'Tipo',
        type: 'string',
        sort: false,
      },
      tille: {
        title: 'TILLE',
        type: 'string',
        sort: false,
      },
      mes: {
        title: 'Mes',
        type: 'string',
        sort: false,
      },
      anio: {
        title: 'Año TILLE',
        type: 'string',
        sort: false,
      },
      usuario: {
        title: 'Usuario',
        type: 'string',
        sort: false,
      },
      fechaRegristro: {
        title: 'Fecha Registro',
        type: Date,
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private parameterTiieService: ParameterTiieService
  ) {
    super();
  }
  ngOnInit(): void {
    this.getTiie();
  }
  getTiie() {
    this.loading = true;

    this.parameterTiieService.getAll().subscribe({
      next: response => {
        this.cats = response.data;
        console.log(this.cats);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(provider?: any) {
    this.openModal({ provider });
  }

  openModal(context?: Partial<RegistrationOfInterestModalComponent>) {
    const modalRef = this.modalService.show(
      RegistrationOfInterestModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}

const EXAMPLE_DATA = [
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
  {
    tipo: 'ejemplo',
    tille: 'ejemplo',
    mes: '11',
    anio: '2022',
    usuario: 'ejemplo',
    fechaRegristro: new Date(),
  },
];
