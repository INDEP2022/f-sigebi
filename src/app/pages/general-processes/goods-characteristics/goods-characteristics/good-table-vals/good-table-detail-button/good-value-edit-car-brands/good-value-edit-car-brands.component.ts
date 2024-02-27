import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
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
      columns: { ...COLUMNS_BRANDS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBrands());
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

  getSubBrands(brand1: string) {
    this.loading2 = true;

    const filter = new FilterParams();
    const params2 = this.params2.getValue();
    params2.limit = 100;
    this.params2.getValue()['sortBy'] = 'flexValueDependent:ASC';
    this.params2.getValue()['filter.carBrand'] = `${brand1}`;

    this.goodsInvService.getAllSubBrandWithFilter(params2).subscribe({
      next: resp => {
        this.loading2 = false;
        this.subBrands = resp.data;
        console.log('Submarcas:', resp.data);
        //this.totalItems2 = resp.count;
      },
      error: error => {
        this.loading2 = false;
        console.log('Error', error);
      },
    });
  }

  rowSelectSubBrand(event: any) {
    console.log('SubMarca Seleccionada:', event.data.flexValueDependent);
    this.subBrand = event.data.flexValueDependent;
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
      } else {
        this.modalRef.hide();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
