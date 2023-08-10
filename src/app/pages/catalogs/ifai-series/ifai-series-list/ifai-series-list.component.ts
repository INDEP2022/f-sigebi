import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IIfaiSerie } from 'src/app/core/models/catalogs/ifai-serie.model';
import { IfaiSerieService } from 'src/app/core/services/catalogs/ifai-serie.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IfaiSeriesFormComponent } from '../ifai-series-form/ifai-series-form.component';
import { IFAI_SERIE_COLUMNS } from './ifai-serie-columns';

@Component({
  selector: 'app-ifai-series-list',
  templateUrl: './ifai-series-list.component.html',
  styles: [],
})
export class IfaiSeriesListComponent extends BasePage implements OnInit {
  ifai: IIfaiSerie[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private ifaiSerieService: IfaiSerieService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = IFAI_SERIE_COLUMNS;
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
              case 'code':
                searchFilter = SearchFilter.EQ;
                break;
              case 'typeProcedure':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'registryNumber':
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
    this.ifaiSerieService.getAll(params).subscribe({
      next: response => {
        this.ifai = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(ifaiSerie?: IIfaiSerie) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ifaiSerie,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getExample());
        }
      },
    };
    this.modalService.show(IfaiSeriesFormComponent, modalConfig);
  }

  delete(ifaiSerie: IIfaiSerie) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(ifaiSerie.status);
      }
    });
  }

  remove(id: string) {
    this.ifaiSerieService.remove(id).subscribe(
      res => {
        this.alert('success', 'Series IFAI', 'Borrado Correctamente');
        this.getExample();
      },
      err => {
        this.alert(
          'warning',
          'Series IFAI',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
