import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  ICategorizationAutomNumerary,
  INumeraryParameterization,
} from 'src/app/core/models/catalogs/numerary-categories-model';
import { NumeraryParameterizationAutomService } from 'src/app/core/services/catalogs/numerary-parameterization-autom.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ModalNumeraryParameterizationComponent } from '../modal-numerary-parameterization/modal-numerary-parameterization.component';
import { NUMERARY_PARAMETERIZATION_COLUMNS } from './numerary-parameterization-columns';

@Component({
  selector: 'app-numerary-parameterization',
  templateUrl: './numerary-parameterization.component.html',
  styles: [],
})
export class NumeraryParameterizationComponent
  extends BasePage
  implements OnInit
{
  numeraryParameterization: INumeraryParameterization[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private numeraryParameterizationAutomService: NumeraryParameterizationAutomService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: NUMERARY_PARAMETERIZATION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;
    this.numeraryParameterizationAutomService
      .getAll(this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.numeraryParameterization = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
  }
  openModal(context?: Partial<ModalNumeraryParameterizationComponent>) {
    const modalRef = this.modalService.show(
      ModalNumeraryParameterizationComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) {
      }
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  showDeleteAlert(event: ICategorizationAutomNumerary) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        if (question.isConfirmed) {
          this.delete(event);
          Swal.fire('Borrado', '', 'success');
        }
      }
    });
  }
  delete(event: ICategorizationAutomNumerary) {
    this.numeraryParameterizationAutomService
      .remove3(JSON.stringify(event))
      .subscribe({
        next: () => this.getValuesAll(),
      });
  }
}
