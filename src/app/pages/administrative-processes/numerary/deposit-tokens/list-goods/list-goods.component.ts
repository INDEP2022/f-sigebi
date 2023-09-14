import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_COLUMNS } from './columns';

@Component({
  selector: 'app-list-goods',
  templateUrl: './list-goods.component.html',
  styles: [],
})
export class ListGoodsComponent extends BasePage implements OnInit {
  title: string = 'Listado de Bienes';
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  rowData: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private accountMovementService: AccountMovementService,
    private goodprocessService: GoodprocessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
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
              no_bien: () => (searchFilter = SearchFilter.EQ),
              no_expediente: () => (searchFilter = SearchFilter.EQ),
              averiguacion_previa: () => (searchFilter = SearchFilter.ILIKE),
              descripcion: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getDataGoods();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getDataGoods();
    });
  }

  getDataGoods() {
    this.seleccionarBien_();
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    // this.goodprocessService.GetGoodProceedings(params).subscribe({
    //   next: async (response: any) => {
    //     console.log('response', response);
    //     this.data1.load(response.data);
    //     this.data1.refresh();
    //     this.totalItems = response.count;
    //     this.loading = false;
    //   },
    //   error: err => {
    //     this.data1.load([]);
    //     this.data1.refresh();
    //     this.totalItems = 0;
    //     this.loading = false;
    //   },
    // });
  }
  close() {
    this.modalRef.hide();
  }
  goodSelect: any = null;
  async onCustomAction(event: any) {
    this.goodSelect = event.data;
    console.log('data', event);
  }

  async seleccionarBien() {}

  async seleccionarBien_() {
    let V_BIEN_VALIDO: any;
    let vb_encontrado: any = false;
    if (
      this.rowData.currency != null &&
      this.rowData.deposito != null &&
      this.rowData.fec_movimiento != null &&
      this.rowData.cveAccount != null
    ) {
      let obj = {
        diCurrency: this.rowData.currency,
        tiBank: this.rowData.bank,
        fecMovement: this.rowData.fec_movimiento,
        diAccount: this.rowData.cveAccount,
      };
      console.log('obj', obj);
      const can: any = await this.getGoodSelectClasif(obj);
      console.log('can', can);

      for (let i = 0; i < can.length; i++) {
        if (can[i].val2 != null) {
          var canVal2 = can[i].val2;
          var number = parseFloat(canVal2.replace(',', ''));

          if (number == this.rowData.deposito) {
            vb_encontrado = await this.getGoodMovimientosCuentas(can[i]);

            if (vb_encontrado) {
              V_BIEN_VALIDO = await this.getGoodMovimientosCuentas1(can[i]);
              if (V_BIEN_VALIDO == 0) {
                let obj: any = {
                  numberMoion: this.rowData.no_movimiento,
                  category: this.rowData.categoria,
                  numberAccount: this.rowData.no_cuenta,
                  numberGood: can[i].no_bien,
                  numberProceedings: can[i].no_expediente,
                };
                this.updateAccountMovement(obj);
              }
            }
          }
        }
      }
      if (!vb_encontrado) {
        this.alert(
          'warning',
          'No se Encontró Ningún Bien que Cumpliera con el Criterio de Conciliación',
          ''
        );
      }
    } else {
      this.alert(
        'warning',
        'No Tiene Capturados Todos los Criterios para Realizar la Conciliación',
        ''
      );
    }
  }

  async getGoodSelectClasif(data: any) {
    return new Promise((resolve, reject) => {
      this.accountMovementService.getBlkMov(data).subscribe({
        next: response => {
          this.data1.load(response.data);
          this.data1.refresh();
          this.totalItems = response.data.length;
          this.loading = false;
          console.log('response', response);
          resolve(response);
        },
        error: err => {
          this.data1.load([]);
          this.data1.refresh();
          this.totalItems = 0;
          this.loading = false;
          resolve(null);
          console.log(null);
        },
      });
    });
  }

  async getGoodMovimientosCuentas(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.no_bien}`;
    params['filter.numberProceedings'] = `$eq:${data.no_expediente}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAllFiltered(params).subscribe({
        next: response => {
          resolve(false);
        },
        error: err => {
          resolve(true);
        },
      });
    });
  }

  async getGoodMovimientosCuentas1(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.no_bien}`;
    return new Promise((resolve, reject) => {
      this.accountMovementService.getAllFiltered(params).subscribe({
        next: response => {
          resolve(1);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async updateAccountMovement(data: any) {
    this.accountMovementService.update(data).subscribe({
      next: async (response: any) => {
        this.alert('success', `Datos Actualizados Correctamente`, '');

        this.modalRef.content.callback(true);
        this.close();
        this.loading = false;
      },
      error: err => {
        this.alert('error', `Error al Actualizar los Datos`, '');
        this.loading = false;
      },
    });
  }
}
