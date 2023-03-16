import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITiieV1 } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterTiieService } from 'src/app/core/services/ms-parametercomer/parameter-tiie.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COUNT_TIIE_COLUMNS } from './registration-of-interest-modal/registration-of-interest-columns';
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
  tiie: ITiieV1;
  tiiesList: ITiieV1[] = [];
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
    columns: { ...COUNT_TIIE_COLUMNS },

    noDataMessage: 'No se encontrarón registros',
  };

  data = this.tiiesList;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private parameterTiieService: ParameterTiieService
  ) {
    super();
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTiie());
    this.settings1.actions.delete = true;
  }

  getTiie() {
    this.loading = true;
    this.parameterTiieService.getAll(this.params.getValue()).subscribe({
      next: data => {
        this.tiiesList = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(provider?: ITiieV1) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      callback: (next: boolean) => {
        if (next) this.getTiie();
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
            this.getTiie();
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
