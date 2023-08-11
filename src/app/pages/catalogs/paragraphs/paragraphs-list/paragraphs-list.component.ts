import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ParagraphsFormComponent } from '../paragraphs-form/paragraphs-form.component';
import { IParagraph } from './../../../../core/models/catalogs/paragraph.model';
import { ParagraphService } from './../../../../core/services/catalogs/paragraph.service';
import { PARAGRAPHS_COLUMNS } from './paragraphs-columns';

@Component({
  selector: 'app-paragraphs-list',
  templateUrl: './paragraphs-list.component.html',
  styles: [],
})
export class ParagraphsListComponent extends BasePage implements OnInit {
  columns: IParagraph[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private paragraphService: ParagraphService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PARAGRAPHS_COLUMNS;
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
    this.paragraphService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
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

  openForm(paragraph?: IParagraph) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      paragraph,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(ParagraphsFormComponent, modalConfig);
  }

  showDeleteAlert(batch: IParagraph) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.delete(batch.id);
      }
    });
  }

  delete(id?: number) {
    this.paragraphService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Párrafo', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Párrafo',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
