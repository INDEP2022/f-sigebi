import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [],
})
export class ListComponent extends BasePage implements OnInit {
  title: string = 'Bienes Cargados';
  form: FormGroup;
  data: any;
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private survillanceService: SurvillanceService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    console.log('data', this.data);
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              recordId: () => (searchFilter = SearchFilter.EQ),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              address: () => (searchFilter = SearchFilter.ILIKE),
              transferee: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.search', filter.search);
              if (filter.search == 'motionDate') {
              }
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              console.log(
                'this.columnFilters[field]',
                this.columnFilters[field]
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getDataVIG_SUPERVISION_TMP();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getDataVIG_SUPERVISION_TMP();
    });
  }

  async getDataVIG_SUPERVISION_TMP() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['filter.delegationNumber'] = `$eq:${this.data.delegationNo}`;
    params['filter.cvePeriod'] = `$eq:${this.data.lvCvePeriod}`;
    if (this.data.typeDelegation) {
      params['filter.delegationType'] = `$eq:${this.data.typeDelegation}`;
    }
    params['sortBy'] = 'recordId:ASC';
    this.survillanceService.getVigSupervisionTmp(params).subscribe({
      next: async (response: any) => {
        console.log('GET DATA', response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.data1.load([]);
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
