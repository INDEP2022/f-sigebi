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
    //this.getAllByUser();
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
  getAllByUser() {
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    this.data2 = [];
    this.localData2.load(this.data2);
    let proceedingNumbers: any = [];
    this.detailProceeDelRecService
      .getByUserTmpEst(this.user, params)
      .subscribe({
        next: response => {
          console.log('respuesta primer servicio ', response);
          for (let i = 0; i < response.data.length; i++) {
            let params = {
              key: response.data[i].programmation.minutesKey,
              status: response.data[i].programmation.statusMinutes,
              user: response.data[i].programmation.user,
              noActa: response.data[i].minutesNum,
            };
            this.data2.push(params);
            this.localData2.load(this.data2);
            this.localData2.refresh();
            this.totalItems2 = response.count;
          }
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
      .subscribe(() => this.getAllByUser());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
    this.selectedRow.noActa;
    this.getGoodByNoActa(this.selectedRow.noActa);
  }

  getGoodByNoActa(NoActa: number) {
    if (this.selectedRow.noActa == null) {
      return;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.data1 = [];
    this.localData.load(this.data1);
    this.programmingGoodReceiptService.getTmpGoods(NoActa, params).subscribe({
      next: response => {
        console.log('respuesta TMP GOODS ', response);
        for (let i = 0; i < response.data.length; i++) {
          //this.getGood(response.data[i].numberGood, NoActa);
          const Ini =
            response.data[i].vindprogrammation.iniDate != null
              ? new Date(response.data[i].vindprogrammation.iniDate)
              : null;
          const formattedfecIni = Ini != null ? this.formatDate(Ini) : null;
          const Fin =
            response.data[i].vindprogrammation.endDate != null
              ? new Date(response.data[i].vindprogrammation.endDate)
              : null;
          const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
          let params = {
            NumberGood: response.data[i].numberGood,
            status: response.data[i].good.status,
            description: response.data[i].good.description,
            quantity: response.data[i].good.quantity,
            DateIni: formattedfecIni,
            DateFin: formattedfecFin,
          };
          this.data1.push(params);
          this.localData.load(this.data1);
        }
        this.totalItems = response.count;
      },
      error: err => {
        this.alert('error', 'Error', 'El Acta no Tiene asociado Ningun Bien');
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
