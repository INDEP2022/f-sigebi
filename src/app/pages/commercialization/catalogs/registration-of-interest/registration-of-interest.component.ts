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
  tiies: ITiieV1;
  cats: ITiieV1[] = [];
  tiiesList: any[];
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
      id: {
        title: 'Id',
        type: 'number',
        sort: false,
      },
      tiieDays: {
        title: 'Tiie Days',
        type: 'number',
        sort: false,
      },
      tiieAverage: {
        title: 'Tiie Average',
        type: 'number',
        sort: false,
      },
      tiieMonth: {
        title: 'Tiie Month',
        type: 'number',
        sort: false,
      },
      tiieYear: {
        title: 'Tiie Year',
        type: 'number',
        sort: false,
      },
      registryDate: {
        title: 'Registry Date',
        type: 'string',
        sort: false,
      },
      user: {
        title: 'User',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = this.parameterTiieService.getTiie();
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
    this.parameterTiieService.getAll(this.params.getValue()).subscribe({
      next: data => {
        this.tiiesList = data.data;
        console.log(this.tiiesList);
        // this.cats = data;
        // this.totalItems = response.count;
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
