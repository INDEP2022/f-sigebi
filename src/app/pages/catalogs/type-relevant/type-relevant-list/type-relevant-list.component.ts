import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeRelevantFormComponent } from '../type-relevant-form/type-relevant-form.component';
import { TYPERELEVANT_COLUMS } from './type-relevant-columns';

@Component({
  selector: 'app-type-relevant-list',
  templateUrl: './type-relevant-list.component.html',
  styles: [],
})
export class TypeRelevantListComponent extends BasePage implements OnInit {
  TypeRelevant: ITypeRelevant[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private typeRelevantService: TypeRelevantService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPERELEVANT_COLUMS;
    this.settings.actions.delete = false;
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
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              case 'numberPhotography':
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
    this.typeRelevantService.getAll(params).subscribe({
      next: response => {
        this.TypeRelevant = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeRelevant?: ITypeRelevant) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      typeRelevant,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(TypeRelevantFormComponent, modalConfig);
  }

  showDeleteAlert(typeRelevant: ITypeRelevant) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(typeRelevant.id);
      }
    });
  }

  delete(id: number) {
    this.typeRelevantService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Tipo relevante', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Tipo Relevante',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
