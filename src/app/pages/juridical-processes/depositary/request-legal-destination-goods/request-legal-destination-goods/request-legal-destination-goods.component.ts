/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { LEGAL_DESTINITY_2_COLUMNS } from './columns/request-legal-destination-goods.columns';
import { RequestLegalDestinationGoodsService } from './services/request-legal-destination-goods.service';
import {
  ERROR_GOOD_NULL,
  NOT_FOUND_GOOD,
} from './utils/request-legal-destination-goods.message';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-request-legal-destination-goods',
  templateUrl: './request-legal-destination-goods.component.html',
  styleUrls: ['./request-legal-destination-goods.component.scss'],
})
export class RequestLegalDestinationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // tableFactGenSettings = {
  //   actions: {
  //     columnTitle: '',
  //     add: false,
  //     edit: false,
  //     delete: false,
  //   },
  //   hideSubHeader: true, //oculta subheaader de filtro
  //   mode: 'external', // ventana externa

  //   columns: {
  //     fechaDepositaria: {
  //       title: 'Fecha',
  //     },
  //     tipoDepositaria: {
  //       title: 'Tipo',
  //     },
  //     nDiasDepositaria: {
  //       title: 'N. Días',
  //     },
  //     fecRecep: {
  //       title: 'Fec. Recep',
  //     },
  //     usuRecep: {
  //       title: 'Usu. Recep',
  //     },
  //     area: {
  //       title: 'Ärea',
  //     },
  //     nDias: {
  //       title: 'N. Días',
  //     },
  //     fecCierre: {
  //       title: 'Fec. Cierre',
  //     },
  //     usuarioCierre: {
  //       title: 'Usuario Cierre',
  //     },
  //   },
  // };
  // // tipoDepositaria --- Depositaría,Administrador,Interventor,Comodato
  // dataFactGen = [
  //   {
  //     fechaDepositaria: '18/09/2022',
  //     tipoDepositaria: 'Depositaría,Administrador,Interventor,Comodato',
  //     nDiasDepositaria: 1,
  //     fecRecep: '18/09/2022',
  //     usuRecep: 'Usu. Recep',
  //     area: 'Ärea',
  //     nDias: 1,
  //     fecCierre: '18/09/2022',
  //     usuarioCierre: 'Usuario Cierre',
  //   },
  // ];

  tableFactGenSettings = { ...TABLE_SETTINGS };
  dataFactGen: any[] = [];

  public form: FormGroup;
  good: IGood;
  loadingTable: boolean = false;

  goods = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private svRequestLegalDestinationGoodsService: RequestLegalDestinationGoodsService,
    private goodFinderServices: GoodFinderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods();
    this.loading = false;
    this.tableFactGenSettings.actions = {
      columnTitle: '',
      position: '',
      add: false,
      edit: false,
      delete: false,
    };
    this.tableFactGenSettings.columns = { ...LEGAL_DESTINITY_2_COLUMNS };
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ], //*
      descripcion: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ], //*
    });
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  selectGood(data: any) {
    console.log(data);
    console.log(this.form.get('noBien').value);
  }

  getGoods(params?: any) {
    console.log(params);
    const paramsF = new FilterParams();
    if (params) {
      paramsF.page = params.page;
      if (params.text != '') {
        if (isNaN(Number(params.text))) {
          paramsF.addFilter('description', params.text, SearchFilter.LIKE);
        } else {
          paramsF.addFilter('id', params.text);
        }
      }
    }

    this.loading = true;
    this.goodFinderServices.goodFinder(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((item: any) => {
          return {
            ...item,
            bindLabel: `${item.id} - ${item.description}`,
          };
        });
        this.goods = new DefaultSelect(newData);
        this.loading = false;
      },
      err => {
        console.log(err);
        this.goods = new DefaultSelect();
        this.loading = false;
      }
    );
  }

  async getGoodData() {
    if (this.form.get('noBien').valid) {
      this.loading = true;
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('goodId', this.form.get('noBien').value);
      await this.svRequestLegalDestinationGoodsService
        .getGoodDataByFilter(params.getParams())
        .subscribe({
          next: res => {
            console.log(res);
            this.good = res.data[0]; // Set data good
            this.form.get('descripcion').setValue(this.good.description);
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            console.log(err);
            this.alert(
              'warning',
              'Número de Bien',
              NOT_FOUND_GOOD(err.error.message)
            );
          },
        });
    } else {
      this.alert('warning', 'Número de Bien', ERROR_GOOD_NULL);
    }
  }
}
