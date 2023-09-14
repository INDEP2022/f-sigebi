import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from '../../../surveillance-service/surveillance-service/list/columns';

@Component({
  selector: 'app-list-randoms',
  templateUrl: './list-randoms.component.html',
  styles: [],
})
export class ListRandomsComponent extends BasePage implements OnInit {
  title: string = 'Lista de Bienes Disponibles';
  form: FormGroup;

  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  goods: LocalDataSource = new LocalDataSource();

  objGetSupervionDet: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService,
    private survillanceService: SurvillanceService
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
    this.goods
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
    params[
      'filter.delegationNumber'
    ] = `$eq:${this.objGetSupervionDet.delegationNumber}`;
    params['filter.cvePeriod'] = `$eq:${this.objGetSupervionDet.cvePeriod}`;
    params[
      'filter.delegationType'
    ] = `$eq:${this.objGetSupervionDet.delegationType}`;
    this.survillanceService.getVigSupervisionTmp(params).subscribe({
      next: async (response: any) => {
        console.log('EDED2', response);
        this.goods.load(response.data);
        this.goods.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.goods.load([]);
        this.goods.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async getVigSupervisionDet_() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    // const params = new FilterParams();
    params[
      'filter.delegationNumber'
    ] = `$eq:${this.objGetSupervionDet.delegationNumber}`;
    params['filter.cveProcess'] = `$eq:${this.objGetSupervionDet.cveProcess}`;
    params['filter.cvePeriod'] = `$eq:${this.objGetSupervionDet.cvePeriod}`;
    params[
      'filter.delegationType'
    ] = `$eq:${this.objGetSupervionDet.delegationType}`;

    // return new Promise((resolve, reject) => {
    this.survillanceService.getVigSupervisionDet(params).subscribe({
      next: async (response: any) => {
        console.log('EDED2', response);
        this.goods.load(response.data);
        this.goods.refresh();
        this.totalItems = response.count;
        this.loading = false;
        // resolve(response.data);
      },
      error: error => {
        this.goods.load([]);
        this.goods.refresh();
        this.totalItems = 0;
        this.loading = false;
        // resolve(null);
      },
    });
    // });
  }
  close() {
    this.modalRef.hide();
  }

  seleccionar() {
    this.modalRef.content.callback(this.goodSelect);
    this.modalRef.hide();
  }

  goodSelect: any = null;
  async onCustomAction2(event: any) {
    console.log();
    this.goodSelect = event.data;
  }
}
