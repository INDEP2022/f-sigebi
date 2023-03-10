import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILegalAffair } from 'src/app/core/models/catalogs/legal-affair-model';
import { LegalAffairService } from 'src/app/core/services/catalogs/legal-affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { LegalAffairDetailComponent } from '../legal-affair-detail/legal-affair-detail.component';
import { LEGAL_AFFAIR_COLUMNS } from './columns';

@Component({
  selector: 'app-legal-affair-list',
  templateUrl: './legal-affair-list.component.html',
  styles: [],
})
export class LegalAffairListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  legalAffairList: ILegalAffair[] = [];

  constructor(
    private modalService: BsModalService,
    private legalAffairService: LegalAffairService
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
      columns: { ...LEGAL_AFFAIR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLegalAffairAll());
  }

  getLegalAffairAll() {
    this.loading = true;

    this.legalAffairService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.legalAffairList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openForm(legalAffair?: ILegalAffair) {
    let config: ModalOptions = {
      initialState: {
        legalAffair,
        callback: (next: boolean) => {
          if (next) this.getLegalAffairAll();
          console.log('cerrando');
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LegalAffairDetailComponent, config);
  }

  showDeleteAlert(legalAffair?: ILegalAffair) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(legalAffair.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.legalAffairService.remove(id).subscribe({
      next: () => this.getLegalAffairAll(),
    });
  }
}
