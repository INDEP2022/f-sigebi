import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { COLUMNS_BRANDS, COLUMNS_SUB_BRANDS } from './columns-brands';

@Component({
  selector: 'app-good-value-edit-car-brands',
  standalone: true,
  templateUrl: './good-value-edit-car-brands.html',
  styleUrls: ['./good-value-edit-car-brands.component.css'],
  imports: [CommonModule, SharedModule],
})
export class GoodValueEditCarBrandsComponent
  extends BasePage
  implements OnInit
{
  test: any;
  brand: string;
  subBrand: string;

  brands = new LocalDataSource();
  totalItems: 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  subBrands = new LocalDataSource();
  totalItems2: 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  loading2 = this.loading;
  disabled: boolean = true;

  columnFilter: any = [];

  settings2 = {
    ...this.settings,
    mode: 'inline',
    actions: {
      columnTitle: 'Acciones',
      edit: false,
      delete: false,
      add: false,
      position: 'left',
    },
    hideSubHeader: false,
    columns: { ...COLUMNS_SUB_BRANDS },
  };

  constructor(
    public modalRef: BsModalRef,
    private goodsInvService: GoodsInvService
  ) {
    super();
    this.settings = {
      ...this.settings,
      mode: 'inline',
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'left',
      },
      hideSubHeader: false,
      columns: { ...COLUMNS_BRANDS },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBrands());*/

    this.subBrands
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'carBrand':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'flexValueDependent':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter[field];
            }
          });

          this.params2 = this.pageFilter(this.params2);
          this.getSubBrands();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSubBrands());
  }

  getBrands() {
    this.loading = true;
    //const filter = new FilterParams();
    const params = this.params.getValue();
    this.params.getValue()['sortBy'] = 'flexValue:ASC';
    this.goodsInvService.getAllBrandWithFilter(params).subscribe({
      next: resp => {
        this.loading = false;
        console.log('Marcas', resp.data);
        this.brands = resp.data;
        this.totalItems = resp.count;
        this.brand = resp.data.flexValue;
      },
      error: error => {
        this.loading = false;
        console.log('Error', error);
      },
    });
  }

  rowSelectBrand(event: any) {
    //this.totalItems2 = 0;
    this.brand = event.data.flexValue;

    this.getSubBrands(this.brand);
  }

  getSubBrands(brand1?: string) {
    this.loading2 = true;
    this.params2.getValue()['sortBy'] = 'carBrand:ASC';

    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilter,
    };

    this.goodsInvService.getAllSubBrandWithFilter(params2).subscribe({
      next: resp => {
        this.loading2 = false;
        this.subBrands.load(resp.data);
        this.subBrands.refresh();
        this.totalItems2 = resp.count;
      },
      error: error => {
        this.loading2 = false;
        console.log('Error', error);
      },
    });
  }

  rowSelectSubBrand(event: any) {
    console.log('SubMarca Seleccionada:', event.data.flexValueDependent);
    this.disabled = false;
    this.subBrand = event.data.flexValueDependent;
    this.brand = event.data.carBrand;
  }

  confirm() {
    const brand = this.brand;
    const subBrand = this.subBrand;
    console.log('Marca', brand);
    console.log('Sub Marca', subBrand);

    this.alertQuestion(
      'warning',
      `Seleccionó Marca: ${brand} y SubMarca: ${subBrand} `,
      '¿Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.modalRef.content.callback(brand, subBrand);
        this.modalRef.hide();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
