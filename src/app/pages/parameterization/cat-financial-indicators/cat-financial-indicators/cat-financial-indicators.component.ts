import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatFinancialIndicatorsModalComponent } from '../cat-financial-indicators-modal/cat-financial-indicators-modal.component';
import { FINANCIAL_INDICATORS_COLUMNS } from './financial-indicators-columns';
//models
import { IFinancialIndicators } from 'src/app/core/models/catalogs/financial-indicators-model';
//services
import { LocalDataSource } from 'ng2-smart-table';
import { FinancialIndicatorsService } from 'src/app/core/services/catalogs/financial-indicators-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-financial-indicators',
  templateUrl: './cat-financial-indicators.component.html',
  styleUrls: [],
})
export class CatFinancialIndicatorsComponent
  extends BasePage
  implements OnInit
{
  columns: IFinancialIndicators[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  financialIndicators: IFinancialIndicators[] = [];

  constructor(
    private modalService: BsModalService,
    private financialIndicatorsService: FinancialIndicatorsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...FINANCIAL_INDICATORS_COLUMNS },
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
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'name':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'formula':
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
          this.getAttributesFinancialInfo();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.financialIndicatorsService.getAll(params).subscribe({
      next: response => {
        // this.financialIndicators = response.data;
        // this.totalItems = response.count;
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(financialIndicators?: IFinancialIndicators) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      financialIndicators,
      callback: (next: boolean) => {
        if (next) this.getAttributesFinancialInfo();
      },
    };
    this.modalService.show(CatFinancialIndicatorsModalComponent, modalConfig);
  }

  showDeleteAlert(financialIndicators: IFinancialIndicators) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(financialIndicators.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.financialIndicatorsService.remove(id).subscribe({
      next: () => this.getAttributesFinancialInfo(),
    });
  }
}
