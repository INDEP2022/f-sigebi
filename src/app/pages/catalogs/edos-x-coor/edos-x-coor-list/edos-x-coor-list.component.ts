import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IEdosXCoor } from 'src/app/core/models/catalogs/edos-x-coor.model';
import { EdosXCoorService } from 'src/app/core/services/catalogs/edos-x-coor.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EdosXCoorFormComponent } from '../edos-x-coor-form/edos-x-coor-form.component';
import { EDOSXCOOR_COLUMS } from './edos-x-coor-columns';

@Component({
  selector: 'app-edos-x-coor-list',
  templateUrl: './edos-x-coor-list.component.html',
  styles: [],
})
export class EdosXCoorListComponent extends BasePage implements OnInit {
  paragraphs: IEdosXCoor[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private edosXCoorService: EdosXCoorService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = EDOSXCOOR_COLUMS;
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
            filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'noState' ||
            filter.field == 'state' ||
            filter.field == 'stage'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
    this.edosXCoorService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(edosXCoor?: IEdosXCoor) {
    let config: ModalOptions = {
      initialState: {
        edosXCoor,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EdosXCoorFormComponent, config);
  }

  delete(edosXCoor: IEdosXCoor) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(edosXCoor);
      }
    });
  }

  remove(edosXCoor: IEdosXCoor) {
    this.edosXCoorService.remove2(edosXCoor).subscribe({
      next: () => {
        this.alert('success', 'Edos x coor', 'Borrado');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Edos x coor',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
