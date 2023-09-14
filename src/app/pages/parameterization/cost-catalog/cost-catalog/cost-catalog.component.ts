import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCostCatalogComponent } from '../modal-cost-catalog/modal-cost-catalog.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cost-catalog',
  templateUrl: './cost-catalog.component.html',
  styles: [],
})
export class CostCatalogComponent extends BasePage implements OnInit {
  cost: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private serviceCatService: ServiceCatService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'code':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'subaccount':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'unaffordabilityCriterion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cost':
                searchFilter = SearchFilter.EQ;
                break;*/
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
          this.getCostCatalog();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCostCatalog());
  }

  getCostCatalog() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.serviceCatService.getAll(params).subscribe({
      /*next: (resp: any) => {
        if (resp.data) {
          // resp.data.forEach((item: any) => {
          //   this.data1.push({
          //     keyServices: item.code,
          //     descriptionServices: item.description,
          //     typeExpenditure: item.subaccount,
          //     unaffordable: item.unaffordabilityCriterion,
          //     cost: item.cost,
          //   });
          // });

          this.cost = resp.data;
          this.data.load(this.cost);
          console.log(this.data);
          this.data.refresh();
          this.totalItems = resp.count;
        }*/
      next: resp => {
        //this.cost = this.data1;
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openForm(allotment?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      allotment,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getCostCatalog());
        }
      },
    };
    this.modalService.show(ModalCostCatalogComponent, modalConfig);
  }

  delete(drawer: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.serviceCatService.delete(drawer.code).subscribe({
          next: (resp: any) => {
            if (resp) {
              this.alert(
                'success',
                'Catálogo de Costo',
                'Borrado Correctamente'
              );
              this.getCostCatalog();
            }
          },
        });
      }
    });
  }
}
