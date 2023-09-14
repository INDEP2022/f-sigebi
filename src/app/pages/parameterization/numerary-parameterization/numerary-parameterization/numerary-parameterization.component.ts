import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  ICategorizationAutomNumerary,
  INumeraryParameterization,
} from 'src/app/core/models/catalogs/numerary-categories-model';
import { NumeraryParameterizationAutomService } from 'src/app/core/services/catalogs/numerary-parameterization-autom.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalNumeraryParameterizationComponent } from '../modal-numerary-parameterization/modal-numerary-parameterization.component';
import { NUMERARY_PARAMETERIZATION_COLUMNS } from './numerary-parameterization-columns';

@Component({
  selector: 'app-numerary-parameterization',
  templateUrl: './numerary-parameterization.component.html',
  styles: [],
})
export class NumeraryParameterizationComponent
  extends BasePage
  implements OnInit
{
  numeraryParameterization: INumeraryParameterization[] = [];
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private numeraryParameterizationAutomService: NumeraryParameterizationAutomService
  ) {
    super();
    this.settings.actions.edit = true;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.columns = NUMERARY_PARAMETERIZATION_COLUMNS;
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
              case 'typeProceeding':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'initialCategoryDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'finalCategoryDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'initialCategory':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'finalCategory':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'typeProceeding' ||
            filter.field == 'initialCategoryDetails' ||
            filter.field == 'finalCategoryDetails' ||
            filter.field == 'initialCategory' ||
            filter.field == 'finalCategory'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getValuesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
    console.log(this.data);
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.numeraryParameterizationAutomService.getAllDetail(params).subscribe({
      next: response => {
        this.numeraryParameterization = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(allotment?: ICategorizationAutomNumerary) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      allotment,
      callback: (next: boolean) => {
        if (next) this.getValuesAll();
      },
    };
    this.modalService.show(ModalNumeraryParameterizationComponent, modalConfig);
  }
  showDeleteAlert(event: ICategorizationAutomNumerary) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(event);
      }
    });
  }
  delete(event: ICategorizationAutomNumerary) {
    this.numeraryParameterizationAutomService
      .remove3(JSON.stringify(event))
      .subscribe({
        next: () => {
          this.alert(
            'success',
            'Parametrización de Numerario',
            'Borrado Correctamente'
          );
          this.getValuesAll();
        },
        error: err => {
          this.alert(
            'warning',
            'Parametrización de Numerario',
            'No se puede eliminar el objeto debido a una relación con otra tabla.'
          );
        },
      });
  }
}
