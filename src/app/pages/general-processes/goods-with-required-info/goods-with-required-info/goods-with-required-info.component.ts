import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAttribGoodBad } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IParamsLegalOpinionsOffice } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/legal-opinions-office.component';
import { GOODS_WITH_REQUIRED_INFO_COLUMNS } from './goods-with-required-info-columns';

@Component({
  selector: 'app-goods-with-required-info',
  templateUrl: './goods-with-required-info.component.html',
  styles: [],
})
export class GoodsWithRequiredInfoComponent extends BasePage implements OnInit {
  attribGoodBad: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  groups: any;
  addMo: string;
  motives: any[] = [];
  goodBad: IAttribGoodBad[];
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() customEvent = new EventEmitter<string>();

  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '',
    P_VALOR: '',
    TIPO_VO: '',
    NO_EXP: '',
    CONSULTA: '',
  };
  paramsCurrentScreen = {
    TIPO_PROC: '',
    NO_INDICADOR: '',
  };
  screenKey: string = 'FATRIBREQUERIDO'; // Clave de la pantalla actual
  origin: string = null;
  origin2: string = ''; // Pantalla para regresar a la anterior de la que se llamo
  origin3: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin2

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    //this.settings.actions = false;
    //this.settings.columns = GOODS_WITH_REQUIRED_INFO_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...GOODS_WITH_REQUIRED_INFO_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsCurrentScreen.NO_INDICADOR =
          paramsQuery['NO_INDICADOR'] ?? null;
        this.paramsCurrentScreen.TIPO_PROC = paramsQuery['TIPO_PROC'] ?? null;
        if (this.origin == 'FACTJURDICTAMOFICIO') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
          this.origin3 = paramsQuery['origin3'] ?? null;
        }
      });
    this.attribGoodBad
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAttribGoodBad();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttribGoodBad());
  }

  getAttribGoodBad() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = `id:DESC`;
    if (this.paramsCurrentScreen.TIPO_PROC) {
      params['filter.pair1'] = this.paramsCurrentScreen.TIPO_PROC;
    }
    if (this.paramsCurrentScreen.NO_INDICADOR) {
      params['filter.pair2'] = this.paramsCurrentScreen.NO_INDICADOR;
    }
    this.goodService.getAttribGoodBadAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.totalItems = resp.count || 0;
        this.goodBad = resp.data;
        this.attribGoodBad.load(resp.data);
        this.attribGoodBad.refresh();
        this.loading = false;
        this.groups = this.goodBad.reduce((groups, good) => {
          const id = good.id;
          const motive = good?.motive.replace(this.addMo, '');
          const array = [];
          array.push(motive);
          return array;
        }, {});

        //resp.data;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
  get motivesAsSelect() {
    return this.motives.map(motive => ({
      value: motive.id,
      label: motive.motive,
    }));
  }

  selectMotive(motive: any) {
    console.log(`Se seleccionó el motivo ${motive.label}`);
  }

  openGood(data: any): void {
    //console.log(localStorage.setItem(`Task`, JSON.stringify(data)));
    // localStorage.setItem(`Task`, JSON.stringify(data));
    localStorage.setItem(
      'selectedBad',
      JSON.stringify({
        id: data.id,
        motive: data.motive,
        pair1: data.pair1,
        pair2: data.pair2,
        pair3: data.pair3,
        pair4: data.pair4,
      })
    );
    if (data.requestId !== null && data.urlNb !== null) {
      // this.router.navigate([`/pages/general-processes/goods-characteristics`], {
      //   queryParams: { noBien: data.id.id },
      // });
      let url = `${`/pages/general-processes/goods-characteristics`}`;
      /*
      console.log(url, data);
      this.customEvent.emit('Hola');*/
      //console.log()
      // this.router.navigateByUrl(url);
      this.router.navigate([url], {
        queryParams: {
          ...this.paramsScreen,
          ...this.paramsCurrentScreen,
          origin: this.screenKey,
          origin1: this.origin,
          origin2: this.origin2,
          origin3: this.origin3,
          noBien: data.id,
          TIPO_PROC: this.paramsCurrentScreen.TIPO_PROC,
          NO_INDICADOR: this.paramsCurrentScreen.NO_INDICADOR,
        },
      });
    } else {
      this.alert('warning', 'No disponible', 'Tarea no disponible');
    }
  }

  goBack() {
    if (this.origin == 'FACTJURDICTAMOFICIO') {
      this.router.navigate(
        [`/pages/juridical/depositary/legal-opinions-office`],
        {
          queryParams: {
            ...this.paramsScreen,
            origin: this.origin2,
            origin3: this.origin3,
          },
        }
      );
    }
  }
}
