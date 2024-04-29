import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { BasePage } from 'src/app/core/shared';
import {
  SERVICEORDERSFORMATEXPEDIENTGOOD_COLUMNS,
  SERVICEORDERSFORMATEXPEDIENT_COLUMNS,
} from './service-orders-format-expedient-columns';

@Component({
  selector: 'app-service-orders-expedient-modal',
  templateUrl: './service-orders-expedient-modal.component.html',
  styles: [],
})
export class ServiceOrdersExpedientModalComponent
  extends BasePage
  implements OnInit
{
  data: any;
  localData: LocalDataSource = new LocalDataSource();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  localData2: LocalDataSource = new LocalDataSource();
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  user: any;
  selectedRow: any;
  columnFilters: any = [];
  BIENES: any;
  selectedRows: any = [];
  flag: boolean = false;
  settings2 = {
    ...this.settings,
    actions: false,
    hideSubHeader: false,
    columns: SERVICEORDERSFORMATEXPEDIENT_COLUMNS,
  };
  loading2: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private authService: AuthService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private strategyProcessService: StrategyProcessService,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private goodService: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      selectMode: 'multi',
      columns: SERVICEORDERSFORMATEXPEDIENTGOOD_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getuser();
    this.filterB();
    this.filterA();
    console.log('BIENES ', this.BIENES);
    console.log('data ', this.data);
  }

  close() {
    this.modalRef.hide();
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
  }
  getAllByUser(msg?: boolean) {
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    this.detailProceeDelRecService
      .getByUserTmpEst(this.user, params)
      .subscribe({
        next: response => {
          let result = response.data.map(item => {
            item['key'] = item.programmation.minutesKey;
            item['status'] = item.programmation.statusMinutes;
            item['user'] = item.programmation.user;
            item['noActa'] = item.minutesNum;
          });
          Promise.all(result).then(resp => {
            this.localData2.load(response.data);
            this.localData2.refresh();
            this.totalItems2 = response.count;
            this.loading = false;
          });
        },
        error: err => {
          if (msg)
            this.alert('warning', 'El Usuario no tiene Actas asociadas', '');
          this.localData2.load([]);
          this.localData2.refresh();
          this.totalItems2 = 0;
          this.loading = false;
        },
      });
  }

  filterA() {
    this.localData2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'key':
                field = `filter.programmation.minutesKey`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                field = `filter.programmation.statusMinutes`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'user':
                field = `filter.programmation.user`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'formatKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'recordNumber':
                searchFilter = SearchFilter.EQ;
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
          this.params2 = this.pageFilter(this.params2);
          this.getAllByUser();
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllByUser(true));
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
    this.selectedRow.noActa;
    this.getGoodByNoActa(this.selectedRow.noActa, true);
  }

  getGoodByNoActa(NoActa: number, val?: boolean) {
    if (!this.selectedRow.noActa) {
      return;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.loading2 = true;
    this.programmingGoodReceiptService.getTmpGoods(NoActa, params).subscribe({
      next: response => {
        console.log('respuesta TMP GOODS ', response);
        let result = response.data.map(item => {
          item['NumberGood'] = item.numberGood;
          item['status'] = item.good.status;
          item['description'] = item.good.description;
          item['quantity'] = item.good.quantity;
          item['DateIni'] = item.vindprogrammation.iniDate;
          item['DateFin'] = item.vindprogrammation.endDate;
        });

        Promise.all(result).then(resp => {
          this.localData.load(response.data);
          this.localData.refresh();
          this.totalItems = response.count;
          this.loading2 = false;
        });
      },
      error: err => {
        this.localData.load([]);
        this.localData.refresh();
        this.totalItems = 0;
        this.loading2 = false;
        if (val) this.alert('warning', 'El Acta no tiene Bienes asociados', '');
      },
    });
  }

  filterB() {
    this.localData
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'NumberGood':
                field = `filter.numberGood`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                field = `filter.good.status`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                field = `filter.good.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                field = `filter.good.quantity`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'DateIni':
                var raw = filter.search;
                var formatted = new DatePipe('en-EN').transform(
                  raw,
                  'yyyy-MM-dd',
                  'UTC'
                );
                filter.search = formatted;
                field = `filter.vindprogrammation.iniDate`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'DateFin':
                var raw = filter.search;
                var formatted = new DatePipe('en-EN').transform(
                  raw,
                  'yyyy-MM-dd',
                  'UTC'
                );
                filter.search = formatted;
                field = `filter.vindprogrammation.endDate`;
                searchFilter = SearchFilter.EQ;
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
          this.params = this.pageFilter(this.params);
          this.getGoodByNoActa(this.selectedRow.noActa);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByNoActa(this.selectedRow.noActa));
  }

  getGood(numberGood: any, NoActa: any) {
    this.goodService.getGoodByNoGood(numberGood).subscribe({
      next: response => {
        console.log('Respuesta GOOD ', response);
        this.getVProgramacion(response.data[0], numberGood, NoActa);
      },
      error: err => {
        this.alert(
          'error',
          'Error',
          'El Bien asociado a el Acta no se Encuentra en la tabla de Bienes'
        );
      },
    });
  }

  getVProgramacion(goods: any, numberGood: any, NoActa: any) {
    this.strategyProcessService.ByIdActaNoGood(NoActa, numberGood).subscribe({
      next: response => {
        console.log('respuesta Vista ', response);
        this.LoadTableGoods(goods, numberGood, NoActa, response.data[0]);
      },
      error: err => {
        this.LoadTableGoods(goods, numberGood, NoActa, null);
      },
    });
  }

  LoadTableGoods(goods: any, numberGood: any, NoActa: any, vista: any) {
    const Ini = vista.fecha_ini != null ? new Date(vista.fecha_ini) : null;
    const formattedfecIni = Ini != null ? this.formatDate(Ini) : null;
    const Fin = vista.fecha_fin != null ? new Date(vista.fecha_fin) : null;
    const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
    let params = {
      NumberGood: goods.goodId,
      status: goods.status,
      description: goods.description,
      quantity: goods.quantity,
      DateIni: formattedfecIni,
      DateFin: formattedfecFin,
    };
    this.data1.push(params);
    this.localData.load(this.data1);
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}/${month}/${day}`;
  }

  Apply() {
    if (this.BIENES == 1) {
      this.PuIncorpBienPro();
    } else {
      this.PuIncorpBien();
    }
  }
  selectRows(rows: any[]) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      console.log('SelectRows', this.selectedRows[0].noBien);
      this.flag = true;
    } else {
      this.flag = false;
      this.selectedRows = [];
    }
  }

  PuIncorpBienPro() {
    let lv_TOTREG = 0;
    this.programmingGoodReceiptService.getTmpGoodsByuser(this.user).subscribe({
      next: response => {
        lv_TOTREG = response.count;
        if (this.selectedRows.length != 0) {
          this.alertQuestion(
            'question',
            '',
            'Se incorporan ' +
              this.selectedRows.length +
              ' Bienes a la Estragia de Administración ¿Deseas Continuar?',
            'Continuar',
            'Cancelar'
          ).then(question => {
            if (question.isConfirmed) {
              let params = {
                numpro: 1,
                format: this.data.noformato,
                process: this.data.noProcess,
                status: this.data.status,
              };
              this.strategyProcessService.ByFormatNumber(params).subscribe({
                next: response => {
                  this.alert(
                    'success',
                    'Exitoso',
                    'Se Incorporaron los Bienes Correctamente'
                  );
                  this.close();
                },
              });
            }
          });
        } else {
          this.alert(
            'warning',
            'Alerta',
            'No hay Bienes Seleccionados, para Incorporar a la Estrategia'
          );
        }
      },
      error: err => {
        lv_TOTREG = 0;
        this.alert(
          'warning',
          'Alerta',
          'No hay Bienes Seleccionados, para Incorporar a la Estrategia'
        );
      },
    });
  }

  PuIncorpBien() {
    let lv_TOTREG = 0;
    this.programmingGoodReceiptService
      .getTmpGoodsByuserandVal(this.user)
      .subscribe({
        next: response => {
          lv_TOTREG = response.count;
          if (this.selectedRows.length != 0) {
            this.alertQuestion(
              'question',
              '',
              'Se incorporan ' +
                this.selectedRows.length +
                ' Bienes a la Estragia de Administración ¿Deseas Continuar?',
              'Continuar',
              'Cancelar'
            ).then(question => {
              if (question.isConfirmed) {
                let params = {
                  numpro: 1,
                  format: this.data.noformato,
                  process: this.data.noProcess,
                  status: this.data.status,
                };
                this.strategyProcessService.ByFormatNumber(params).subscribe({
                  next: response => {
                    this.alert(
                      'success',
                      'Exitoso',
                      'Se Incorporaron los Bienes Correctamente'
                    );
                    this.close();
                  },
                });
              }
            });
          } else {
            this.alert(
              'warning',
              'Alerta',
              'No hay Bienes Seleccionados, para Incorporar a la Estrategia'
            );
          }
        },
        error: err => {
          lv_TOTREG = 0;
          this.alert(
            'warning',
            'Alerta',
            'No hay Bienes Seleccionados, para Incorporar a la Estrategia'
          );
        },
      });
  }
}
