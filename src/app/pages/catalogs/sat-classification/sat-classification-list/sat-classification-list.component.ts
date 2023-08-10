import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClassificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SatClassificationFormComponent } from '../sat-classification-form/sat-classification-form.component';
import { SAT_CLASSIFICATION_COLUMNS } from './sat-classification-columns';

@Component({
  selector: 'app-sat-classification-list',
  templateUrl: './sat-classification-list.component.html',
  styles: [],
})
export class SatClassificationListComponent extends BasePage implements OnInit {
  satClasification: ISatClassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private satClassificationService: SatClassificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAT_CLASSIFICATION_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
    };
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
              case 'nombre_clasificacion':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getSatClasifications();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSatClasifications());
  }

  getSatClasifications() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.satClassificationService.getAll(params).subscribe({
      next: response => {
        this.satClasification = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(satclasification?: ISatClassification) {
    const modalConfig = MODAL_CONFIG;
    console.log(satclasification);
    modalConfig.initialState = {
      satclasification,
      callback: (next: boolean) => {
        if (next) this.getSatClasifications();
      },
    };
    this.modalService.show(SatClassificationFormComponent, modalConfig);
  }

  showDeleteAlert(satclasification: ISatClassification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(satclasification.id);
        this.getSatClasifications();
      }
    });
  }

  delete(id: number) {
    this.satClassificationService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'SAT Clasificación', 'Borrado Correctamente');
        this.getSatClasifications();
      },
      error: err => {
        this.alert(
          'warning',
          'Sub-tipo',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
