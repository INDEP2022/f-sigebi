import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDrawer } from 'src/app/core/models/catalogs/drawer.model';
import { DrawerService } from 'src/app/core/services/catalogs/drawer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DrawerFormComponent } from '../drawer-form/drawer-form.component';
import { DRAWERS_COLUMNS } from './drawers-columns';

@Component({
  selector: 'app-drawers-list',
  templateUrl: './drawers-list.component.html',
  styles: [],
})
export class DrawersListComponent extends BasePage implements OnInit {
  paragraphs: IDrawer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private drawerService: DrawerService
  ) {
    super();
    this.settings.columns = DRAWERS_COLUMNS;
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
              case 'noDrawer':
                searchFilter = SearchFilter.EQ;
                break;
              case 'safeDetails':
                field = `filter.${filter.field}.description`;
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
          this.getDrawers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDrawers());
  }

  getDrawers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.drawerService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  openForm(drawer?: IDrawer) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      drawer,
      callback: (next: boolean) => {
        if (next) this.getDrawers();
      },
    };
    this.modalService.show(DrawerFormComponent, modalConfig);
  }

  showDeleteAlert(drawer: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(drawer.id);
      }
    });
  }

  delete(id: number) {
    this.drawerService.delete(id).subscribe({
      next: response => {
        this.alert('success', 'Gaveta', 'Borrada Correctamente'),
          this.getDrawers();
      },
      error: err => {
        this.alert(
          'warning',
          'Gaveta',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
