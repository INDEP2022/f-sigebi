import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { AffailrDetailComponent } from '../affailr-detail/affailr-detail.component';
import { AFFAIR_COLUMNS } from './columns';

@Component({
  selector: 'app-affair-list',
  templateUrl: './affair-list.component.html',
  styles: [],
})
export class AffairListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  affairList: IAffair[] = [];

  constructor(
    private modalService: BsModalService,
    private affairService: AffairService
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
      columns: { ...AFFAIR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairAll());
  }

  getAffairAll() {
    this.loading = true;

    this.affairService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.affairList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openForm(affair?: IAffair) {
    let config: ModalOptions = {
      initialState: {
        affair,
        callback: (next: boolean) => {
          if (next) this.getAffairAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AffailrDetailComponent, config);
  }

  showDeleteAlert(affair?: IAffair) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(affair.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.affairService.remove(id).subscribe({
      next: () => this.getAffairAll(),
    });
  }
}
