import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Columns
import {
  COMI_XTHIRC_COLUMNS,
  THIRD_COLUMNS,
  TYPE_EVENT_THIRD_COLUMNS,
} from './columns';
//Services
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  IComiXThird,
  IThirdParty,
  ITypeEventXtercomer,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ComiXThirdService } from 'src/app/core/services/ms-thirdparty/comi-xthird.service';
import { TypeEventXterComerService } from 'src/app/core/services/ms-thirdparty/type-events-xter-comer.service';
import { AmountThirdModalComponent } from '../amount-third-modal/amount-third-modal.component';
import { ThirdPartyModalComponent } from '../third-party-modal/third-party-modal.component';
import { TypeEventModalComponent } from '../type-event-modal/type-event-modal.component';

@Component({
  selector: 'app-third-party-marketers',
  templateUrl: './third-party-marketers.component.html',
  styles: [],
})
export class ThirdPartyMarketersComponent extends BasePage implements OnInit {
  data: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  thirdPartyList: LocalDataSource = new LocalDataSource();
  typeEventList: LocalDataSource = new LocalDataSource();
  amountList: LocalDataSource = new LocalDataSource();
  // thirdPartyList: IThirdParty[] = [];
  // typeEventList: ITypeEventXtercomer[] = [];
  // amountList: IComiXThird[] = [];

  thirPartys: IThirdParty;
  typeEvents: ITypeEventXtercomer;
  amounts: IComiXThird;

  settings2;
  settings3;

  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];

  loading2: boolean = false;
  loading3: boolean = false;

  disabledBtnCerrar: boolean = false;
  acordionOpen: boolean = false;
  constructor(
    private thirdPartyService: ThirdPartyService,
    private typeEventXterComerService: TypeEventXterComerService,
    private comiXThirdService: ComiXThirdService,
    private modalService: BsModalService,
    private comerTpEventosService: ComerTpEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...THIRD_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...TYPE_EVENT_THIRD_COLUMNS },
    };

    this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COMI_XTHIRC_COLUMNS },
    };
  }

  ngOnInit(): void {
    // TERCEROS COMERCIALIZADORES //
    this.thirdPartyList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              nameReason: () => (searchFilter = SearchFilter.ILIKE),
              id: () => (searchFilter = SearchFilter.EQ),
              calculationRoutine: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getThirdPartyAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getThirdPartyAll());

    // TIPOS DE EVENTOS QUE ATIENDE EL TERCERO
    this.getTypeEventFilters();

    // MONTOS //
    this.getAmountsFilters();
  }

  // TIPOS DE EVENTOS QUE ATIENDE EL TERCERO //
  getTypeEventFilters() {
    this.loading2 = false;
    this.typeEventList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              thirdPartyId: () => (searchFilter = SearchFilter.EQ),
              typeEventId: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getTypeEvent(this.thirPartys);
        }
      });
    this.params2
      .pipe(
        skip(1),
        tap(() => {
          this.getTypeEvent(this.thirPartys);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  // MONTOS //
  getAmountsFilters() {
    this.loading3 = false;
    this.amountList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              idThirdParty: () => (searchFilter = SearchFilter.EQ),
              startingAmount: () => (searchFilter = SearchFilter.EQ),
              pctCommission: () => (searchFilter = SearchFilter.EQ),
              finalAmount: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters3[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
            } else {
              delete this.columnFilters3[field];
            }
          });
          this.params3 = this.pageFilter(this.params3);
          //Su respectivo metodo de busqueda de datos
          this.getAmount(this.thirPartys);
        }
      });
    this.params3
      .pipe(
        skip(1),
        tap(() => {
          this.getAmount(this.thirPartys);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  // --------------------------------------------------------------------- //

  getThirdPartyAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.thirdPartyService.getFindItemCustom(params).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartyList.load(response.data);
        this.thirdPartyList.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.thirdPartyList.load([]);
        this.thirdPartyList.refresh();
        this.loading = false;
        console.log(error);
      },
    });
  }

  valAcc: any = null;
  rowsSelected(event: any) {
    if (event.data == this.valAcc) {
      this.acordionOpen = false;
      this.disabledBtnCerrar = false;
      this.valAcc = null;
    } else {
      this.acordionOpen = true;
      this.disabledBtnCerrar = true;
      this.valAcc = event.data;
    }

    this.totalItems2 = 0;
    this.totalItems3 = 0;
    // this.typeEventList = [];
    this.thirPartys = event.data;
    this.rowsSelectedGetAmount(this.thirPartys);
    this.rowsSelectedGetTypeEvent(this.thirPartys);
  }

  rowsSelectedGetTypeEvent(event: any) {
    this.totalItems2 = 0;
    // this.amountList = [];
    // this.typeEvents = event.data;

    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTypeEvent(this.thirPartys));
  }

  getTypeEvent(thirdParty?: IThirdParty) {
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    if (params['filter.thirdPartyId']) return;

    this.loading2 = true;
    this.totalItems2 = 0;

    if (!thirdParty) {
      this.loading2 = false;
      return;
    }
    if (params['filter.description']) {
      params['filter.eventDetail.description'] = params['filter.description'];
      delete params['filter.description'];
    }

    params['filter.thirdPartyId'] = `$eq:${thirdParty.id}`;
    this.typeEventXterComerService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        const result = response.data.map((item: any) => {
          item['description'] = item.eventDetail
            ? item.eventDetail.description
            : null;
        });
        Promise.all(result).then(resp => {
          this.typeEventList.load(response.data);
          this.typeEventList.refresh;
          this.totalItems2 = response.count;
          this.loading2 = false;
        });
      },
      error: error => {
        this.typeEventList.load([]);
        this.typeEventList.refresh;
        this.totalItems2 = 0;
        this.loading2 = false;
      },
    });
    // .pipe(
    //     map((data2: any) => {
    //       let list: IListResponse<ITypeEventXtercomer> =
    //         {} as IListResponse<ITypeEventXtercomer>;
    //       const array2: ITypeEventXtercomer[] = [{ ...data2 }];
    //       list.data = array2;
    //       return list;
    //     })
    //   )
  }

  getDescript() {
    return new Promise((resolve, reject) => {
      this.comerTpEventosService.getEventsByTypeAll().subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  rowsSelectedGetAmount(event: any) {
    this.totalItems3 = 0;
    // this.amountList = [];
    // this.typeEvents = event.data;

    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAmount(this.thirPartys));
  }

  getAmount(IThirdParty?: IThirdParty) {
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };

    if (params['filter.idThirdParty']) return;

    this.loading3 = true;
    this.totalItems3 = 0;

    if (!IThirdParty) {
      this.loading3 = false;
      return;
    }
    params['filter.idThirdParty'] = `${IThirdParty.id}`;
    this.comiXThirdService.getAll_(params).subscribe({
      next: response => {
        console.log(response);
        this.amountList.load(response.data);
        this.amountList.refresh;
        this.totalItems3 = response.count;
        this.loading3 = false;
      },
      error: error => {
        this.amountList.load([]);
        this.amountList.refresh;
        this.totalItems3 = 0;
        this.loading3 = false;
      },
    });
  }

  openForm1(thirPartys?: IThirdParty) {
    if (thirPartys) {
      if (thirPartys == this.valAcc) {
        this.acordionOpen = false;
        this.disabledBtnCerrar = false;
        this.valAcc = null;
      } else {
        this.acordionOpen = true;
        this.disabledBtnCerrar = true;
        this.valAcc = thirPartys;
      }

      this.totalItems2 = 0;
      this.totalItems3 = 0;
      // this.typeEventList = [];
      this.thirPartys = thirPartys;
      console.log(this.thirPartys);
      this.rowsSelectedGetAmount(this.thirPartys);
      this.rowsSelectedGetTypeEvent(this.thirPartys);
    }

    let config: ModalOptions = {
      initialState: {
        thirPartys,
        callback: (next: boolean) => {
          if (next) this.getThirdPartyAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ThirdPartyModalComponent, config);
  }

  openForm2(typeEvents?: ITypeEventXtercomer) {
    if (!this.thirPartys) {
      this.alert('warning', 'Debe Seleccionar un Tercero Comercializador', '');
      return;
    }
    const thirPartys = this.thirPartys;
    let config: ModalOptions = {
      initialState: {
        typeEvents,
        thirPartys,
        callback: (next: boolean) => {
          if (next) {
            if (this.thirPartys) {
              this.rowsSelectedGetTypeEvent(this.thirPartys);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeEventModalComponent, config);
  }

  openForm3(amounts?: IComiXThird) {
    if (!this.thirPartys) {
      this.alert('warning', 'Debe Seleccionar un Tercero Comercializador', '');
      return;
    }
    const thirPartys = this.thirPartys;
    let config: ModalOptions = {
      initialState: {
        amounts,
        thirPartys,
        callback: (next: boolean) => {
          if (next) {
            if (this.thirPartys) {
              this.rowsSelectedGetAmount(this.thirPartys);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AmountThirdModalComponent, config);
  }
  questionDelete1($event: any) {
    console.log($event);
    this.alertQuestion(
      'question',
      '¿Desea Eliminar el Tercero Comercializador?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        this.thirdPartyService.remove($event.id).subscribe({
          next: response => {
            this.alert(
              'success',
              'El Tercero Comercializador se Eliminó Correctamente',
              ''
            );
            this.getThirdPartyAll();
          },
          error: error => {
            if (
              error.error.message ==
              'Ocurrio un error al intentar obtener los datos.'
            ) {
              this.alert(
                'error',
                'Error al Eliminar',
                'El Registro tiene Montos o tipos de Eventos relacionados'
              );
            } else {
              this.alert(
                'error',
                'Ocurrió un Error al Eliminar el Tercero Comercializador',
                ''
              );
            }
          },
        });
      }
    });
  }
  questionDelete2($event: any) {
    console.log($event);
    this.alertQuestion(
      'question',
      '¿Desea Eliminar el Tipo De Evento?',
      ''
    ).then(question => {
      let obj = {
        thirdPartyId: $event.thirdPartyId,
        typeEventId: $event.typeEventId,
      };
      if (question.isConfirmed) {
        this.typeEventXterComerService.remove(obj).subscribe({
          next: response => {
            this.alert(
              'success',
              'El tipo de Evento se Eliminó Correctamente',
              ''
            );
            this.rowsSelectedGetTypeEvent(this.thirPartys);
          },
          error: error => {
            this.alert(
              'error',
              'Ocurrió un Error al Eliminar el tipo de Evento',
              ''
            );
          },
        });
      }
    });
  }
  questionDelete3($event: any) {
    console.log($event);
    this.alertQuestion('question', '¿Desea Eliminar el Monto?', '').then(
      question => {
        if (question.isConfirmed) {
          this.comiXThirdService.remove($event.idComiXThird).subscribe({
            next: response => {
              this.alert('success', 'El Monto se Eliminó Correctamente', '');
              this.rowsSelectedGetAmount(this.thirPartys);
            },
            error: error => {
              this.alert('error', 'Ocurrió un Error al Eliminar el Monto', '');
            },
          });
        }
      }
    );
  }
}
