import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPhotographMedia } from '../../../../core/models/catalogs/photograph-media.model';
import { PhotographMediaService } from '../../../../core/services/catalogs/photograph-media.service';
import { PhotographMediaFormComponent } from '../photograph-media-form/photograph-media-form.component';
import { PHOTOGRAPH_MEDIA_COLUMNS } from './photograph-media-columns';

@Component({
  selector: 'app-photograph-media-list',
  templateUrl: './photograph-media-list.component.html',
  styles: [],
})
export class PhotographMediaListComponent extends BasePage implements OnInit {
  columns: IPhotographMedia[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private photographMediaService: PhotographMediaService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PHOTOGRAPH_MEDIA_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'route':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
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
    this.photographMediaService.getAll(params).subscribe({
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

  openModal(context?: Partial<PhotographMediaFormComponent>) {
    const modalRef = this.modalService.show(PhotographMediaFormComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(photographMedia?: IPhotographMedia) {
    this.openModal({ photographMedia });
  }

  delete(batch: IPhotographMedia) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.ShowDeleteAlert(batch.id);
      }
    });
  }

  ShowDeleteAlert(id: number) {
    this.photographMediaService.removeCatalogPhotographMedia(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Medio fotografía', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Medio Fotografía',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
