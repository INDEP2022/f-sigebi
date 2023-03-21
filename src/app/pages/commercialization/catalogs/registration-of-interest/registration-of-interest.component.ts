import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ITiieV1 } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { COUNT_TIIE_COLUMNS } from './registration-of-interest-modal/registration-of-interest-columns';
import { RegistrationOfInterestModalComponent } from './registration-of-interest-modal/registration-of-interest-modal.component';

@Component({
  selector: 'app-registration-of-interest',
  templateUrl: './registration-of-interest.component.html',
  styleUrls: ['registration-of-interest.component.scss'],
})
export class RegistrationOfInterestComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  tiie: ITiieV1;
  form: FormGroup;
  tiiesList: ITiieV1[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private parameterTiieService: ParameterTiieService
  ) {
    super();
    this.ilikeFilters = ['user'];
    // this.ilikeFilters = ['user'];
    this.service = this.parameterTiieService;
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_TIIE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  openForm(provider?: ITiieV1) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(RegistrationOfInterestModalComponent, modalConfig);
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

  showDeleteAlert(tiie: ITiieV1) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameterTiieService.remove(tiie.id).subscribe({
          next: data => {
            this.loading = false;
            this.onLoadToast('success', 'Registro eliminado', '');
            this.getData();
          },
          error: error => {
            this.onLoadToast('error', 'No se puede eliminar registro', '');
            this.loading = false;
          },
        });
      }
    });
  }

  search() {
    this.parameterTiieService.getAll().subscribe({
      next: (data: any) => {
        if (data) {
          data.map((item: any) => {
            this.tiiesList = data;
          });
        }
      },
    });
  }
}
