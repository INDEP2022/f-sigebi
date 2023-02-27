import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IProficient } from 'src/app/core/models/catalogs/proficient.model';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCatAppraisersComponent } from '../modal-cost-catalog/modal-cat-appraisers.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cat-appraisers',
  templateUrl: './cat-appraisers.component.html',
  styles: [],
})
export class CatAppraisersComponent extends BasePage implements OnInit {
  columns: any[] = [];
  dataTable: LocalDataSource = new LocalDataSource();
  proficient: IListResponse<IProficient> = {} as IListResponse<IProficient>;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private proficientSer: ProeficientService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getProficient();
    });
  }

  private getProficient() {
    this.loading = true;
    this.proficientSer.getAll(this.params.getValue()).subscribe({
      next: resp => {
        this.proficient = resp;
        this.loading = false;
      },
      error: err => {
        this.onLoadToast('error', err.error.message, '');
        this.loading = false;
      },
    });
  }

  openModal(context?: Partial<ModalCatAppraisersComponent>) {
    const modalRef = this.modalService.show(ModalCatAppraisersComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getProficient();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  delete({ id }: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.proficientSer.remove(id).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha eliminado', '');
            this.getProficient();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
