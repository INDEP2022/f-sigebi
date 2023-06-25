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
    private accountMovementService: AccountMovementService
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
              id: () => (searchFilter = SearchFilter.EQ),
              fileNumber: () => (searchFilter = SearchFilter.ILIKE),
              goodClassNumber: () => (searchFilter = SearchFilter.EQ),
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
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['filter.goodClassNumber'] = `$eq:1602`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        console.log('response', response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  close() {
    this.modalRef.hide();
  }
  goodSelect: any = null;
  async onCustomAction(event: any) {
    this.goodSelect = event.data;
    console.log('data', event);
  }

  async seleccionarBien() {
    let V_BIEN_VALIDO: any;
    if (
      this.rowData.currency != null &&
      this.rowData.deposito != null &&
      this.rowData.fec_movimiento != null &&
      this.rowData.cveAccount != null
    ) {
      let obj = {};
      const can: any = await this.getGoodSelectClasif(obj);

      if (can.val2 != null) {
        var canVal2 = can.val2;
        var number = parseFloat(canVal2.replace(',', ''));

        if (number == this.rowData.deposito) {
          let vb_encontrado: any = true;
          vb_encontrado = await this.getGoodMovimientosCuentas(this.goodSelect);

          if (vb_encontrado) {
            V_BIEN_VALIDO = await this.getGoodMovimientosCuentas1(
              this.goodSelect
            );
            if (V_BIEN_VALIDO == 0) {
              let obj: any = {
                numberMotion: this.rowData.no_movimiento,
                numberGood: this.goodSelect.id,
                numberProceedings: this.goodSelect.fileNumber,
              };
              this.updateAccountMovement(obj);
            }
          } else {
            this.alert(
              'warning',
              'No se encontro ningun bien que cumpliera con el criterio de conciliacion',
              ''
            );
          }

          // IF V_BIEN_VALIDO = 0 THEN
          // : blk_mov.no_bien       := can.no_bien;
          // --Aqui obtiene el numero de expediente Numerario V 3.2.1
          //        FOR reg IN(SELECT no_expediente
          //                    FROM   bienes
          //                    WHERE  no_bien = can.no_bien)
          // LOOP
          // : blk_mov.di_expediente2 := reg.no_expediente;
          // EXIT;
          //        END LOOP;
          // --lip_mensaje('entra al proceso' || can.no_bien, 'a');
          //     END IF;
        }
      }
    } else {
      this.alert(
        'warning',
        'No tiene capturados todos los criterios para realizar la conciliación',
        ''
      );
    }
  }

  async getGoodSelectClasif(data: any) {
    return new Promise((resolve, reject) => {
      // this.accountMovementService.getAllFiltered(params).subscribe({
      // next: response => {
      let obj: any = {
        val: 2.3,
      };
      resolve(obj);
      // },
      // error: err => {
      // resolve(true);
      // console.log(false);
      // },
      // });
    });
  }

  async getGoodMovimientosCuentas(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.id}`;
    params['filter.numberProceedings'] = `$eq:${data.fileNumber}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAllFiltered(params).subscribe({
        next: response => {
          resolve(false);
        },
        error: err => {
          resolve(true);
          console.log(false);
        },
      });
    });
  }

  async getGoodMovimientosCuentas1(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.id}`;
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
        this.alert('success', `Datos actualizados correctamente`, '');

        this.modalRef.content.callback(true);
        this.close();
        this.loading = false;
      },
      error: err => {
        this.alert('error', `Error al actualizar los datos`, '');
        this.loading = false;
      },
    });
  }
}
