import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';

import { LocalDataSource } from 'ng2-smart-table';
import { RevisionReasonService } from 'src/app/core/services/catalogs/revision-reason.service';
import { IRevisionReason } from '../../../../core/models/catalogs/revision-reason.model';
import { RevisionReasonFormComponent } from '../revision-reason-form/revision-reason-form.component';
import { REVISION_REASON_COLUMNS } from './revision-reason-columns';

@Component({
  selector: 'app-revision-reason-list',
  templateUrl: './revision-reason-list.component.html',
  styles: [],
})
export class RevisionReasonListComponent extends BasePage implements OnInit {
  columns: IRevisionReason[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private revisionReasonService: RevisionReasonService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = REVISION_REASON_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.revisionReasonService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<RevisionReasonFormComponent>) {
    const modalRef = this.modalService.show(RevisionReasonFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(revisionReason?: IRevisionReason) {
    this.openModal({ revisionReason });
  }

  delete(batch: IRevisionReason) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(batch.id);
      }
    });
  }

  remove(id: number) {
    this.revisionReasonService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert(
            'success',
            'Motivo para Estatus REV',
            'Borrado Correctamente'
          );
      },
      error: error => {
        this.alert(
          'warning',
          'Motivo de Revisión',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
