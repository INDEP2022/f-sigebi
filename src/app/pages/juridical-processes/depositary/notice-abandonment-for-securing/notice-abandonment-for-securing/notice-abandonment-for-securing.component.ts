import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { INotificationClasif } from 'src/app/core/models/ms-notification/clasif';
import { INotificationXProperty } from 'src/app/core/models/ms-notification/notification.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { NoticeAbandonmentForSecuringModalComponent } from './notice-abandonment-for-securing-modal/notice-abandonment-for-securing-modal.component';

function getClassColour(row: INotificationXProperty) {
  // console.log(row);
  return row ? (row.duct === 'EDICTO' ? 'edict' : '') : '';
}
@Component({
  selector: 'app-notice-of-abandonment-by-return',
  templateUrl: './notice-abandonment-for-securing.component.html',
  styleUrls: ['./notice-abandonment-for-securing.component.scss'],
})
export class NoticeAbandonmentForSecuringComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  loadingText = '';
  isdisable: boolean = true;
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  good: any;
  form: FormGroup;
  period: boolean = false;
  selectedRows: any;
  selectedRow: any;
  selectedGood: IGood;
  username: string = '';
  di_permitido = false;
  showTable = true;
  dataArray: INotificationXProperty[] = [];
  clasifNotification: INotificationClasif;
  // di_per1: any;
  // di_per2: any;
  // di_per3: any;
  DI_ESTATUS: any;
  vc_estatusfinal: any;
  vc_estatus_final: any;
  type: string;
  title: string = 'aseguramiento';
  get goodId() {
    return this.form.get('goodId');
  }
  get description() {
    return this.form.get('description');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get periods() {
    return this.form.get('periods');
  }
  get periods1() {
    return this.form.get('periods1');
  }
  get periods2() {
    return this.form.get('periods2');
  }

  get vf_ini1() {
    return this.form.get('vf_ini1');
  }
  get vf_ini2() {
    return this.form.get('vf_ini2');
  }
  get vf_ini3() {
    return this.form.get('vf_ini3');
  }
  get vf_fin1() {
    return this.form.get('vf_fin1');
  }
  get vf_fin2() {
    return this.form.get('vf_fin2');
  }
  get vf_fin3() {
    return this.form.get('vf_fin3');
  }

  get estatus_bien() {
    return this.form.get('estatus_bien');
  }
  constructor(
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private statusScreenService: StatusXScreenService,
    private notificationService: NotificationService,
    private goodService: GoodService,
    private modalService: BsModalService,
    private goodTypesService: GoodTypeService,
    private router: Router,
    private programmingRequestService: ProgrammingRequestService
  ) {
    super();
    this.activateRoute.params.subscribe({
      next: param => {
        console.log(param);

        if (param['id']) {
          this.type = param['id'];
          console.log(this.type);
          if (this.type === 'D') {
            this.title = 'Devolución';
          }
        }
      },
    });
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
    this.prepareForm();
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  openModal(data: INotificationXProperty) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      data,
      goodId: this.good.goodId,
      callback: (next: boolean) => {
        if (next) {
          this.search();
        }
      },
    };
    this.modalService.show(
      NoticeAbandonmentForSecuringModalComponent,
      modalConfig
    );
  }

  private buildForm() {
    this.form = this.fb.group({
      goodId: [null, [Validators.required]],
      description: [null],
      quantity: [null],
      periods: [null],
      periods1: [null],
      periods2: [null],
      vf_ini1: [null],
      vf_ini2: [null],
      vf_ini3: [null],
      vf_fin1: [null],
      vf_fin2: [null],
      vf_fin3: [null],
      estatus_bien: [null],
    });
  }

  delete(body: INotificationXProperty) {
    this.alertQuestion(
      'question',
      '¿Desea eliminar la notificación ' + body.numberProperty,
      ''
    ).then(x => {
      if (x.isConfirmed) {
        this.notificationService
          .deleteNotiXProperty(body)
          .pipe(take(1))
          .subscribe({
            next: response => {
              if (response) {
                this.alert(
                  'success',
                  'Notificación ' + body.numberProperty,
                  'Eliminada correctamente'
                );
              }
            },
            error: err => {
              let error = '';
              error = err.message;
              this.alert('error', 'Notificación ' + body.numberProperty, error);
            },
          });
      }
    });
  }

  async selectGood(event: any) {
    console.log(event);
    this.good = event;
    this.quantity.setValue(event.quantity);
    this.di_permitido = false;
    this.estatus_bien.setValue(null);
    const response = await firstValueFrom(
      this.getStatusXPantalla().pipe(catchError(x => of(null)))
    );
    if (response && response.length > 0) {
      this.di_permitido = true;
    }
    // this.di_permitido = true;
    this.showTable = false;
    console.log(this.di_permitido);
    if (this.di_permitido) {
      this.settings = {
        ...this.settings,
        hideSubHeader: false,
        add: {
          addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        },
        actions: {
          columnTitle: 'Acciones',
          position: 'right',
          edit: true,
          delete: true,
          add: true,
        },
        rowClassFunction: (row: any) => {
          return getClassColour(row.data);
        },
      };
    } else {
      this.settings = {
        ...this.settings,
        hideSubHeader: false,
        actions: false,
        rowClassFunction: (row: any) => {
          return getClassColour(row.data);
        },
      };
    }
    console.log(this.settings);
    setTimeout(() => {
      this.showTable = true;
    }, 100);
    this.data.reset();
    this.data.refresh();
    this.getStatusGood().subscribe({
      next: response => {
        this.estatus_bien.setValue(
          this.good.status + '-' + response.description
        );
      },
    });
  }

  private async postQuery() {
    if (this.di_permitido) {
      this.pup_block_flags();
    } else {
      this.pup_block_flags(true);
    }
  }

  get statusToNotified() {
    return this.type === 'D' ? 'DE,SD' : 'AE,DE';
  }

  private fillDates(data: INotificationXProperty[]) {
    let filter = data.filter(
      x => x.periodEndDate && this.statusToNotified.includes(x.statusNotified)
    );
    if (filter.length === 0) {
      this.alert('warning', 'No hay fechas registradas en los periodos', '');
    }
    filter.forEach((x, index) => {
      if (x.statusNotified === 'AE') {
        if (index === 2) {
          this.vf_ini3.setValue(x.notificationDate);
          this.vf_fin3.setValue(x.periodEndDate);
        }
      }
      if (x.statusNotified === 'DE') {
        if (index === 2) {
          this.vf_ini3.setValue(null);
          this.vf_fin3.setValue(null);
        }
      }
      if (index === 0) {
        this.vf_ini1.setValue(x.notificationDate);
        this.vf_fin1.setValue(x.periodEndDate);
      }
      if (index === 1) {
        this.vf_ini2.setValue(x.notificationDate);
        this.vf_fin2.setValue(x.periodEndDate);
      }
    });
  }

  private MUESTRA_PERIODOS(showDates = false) {
    let filterParams = new FilterParams();
    filterParams.addFilter('numberProperty', this.good.goodId);
    // filterParams.addFilter3('filter.periodEndDate', '$not:$null');
    // filterParams.addFilter('statusNotified', 'AE,DE', SearchFilter.IN);
    this.notificationService
      .getNotificationxProperty(filterParams.getParams())
      .pipe(
        take(1),
        map(x =>
          x.data
            ? x.data.map(row => {
                return {
                  ...row,
                  insertMethod: row.insertMethod
                    ? row.insertMethod
                    : row.duct === 'PERSONAL'
                    ? 'COMPLEMENTO ARTICULO 7o'
                    : 'NOTIFICACION INDICIADO',
                };
              })
            : []
        )
      )
      .subscribe({
        next: response => {
          if (response && response.length > 0) {
            let v_suspension_tem, v_suspension_def;
            response.forEach(x => {
              v_suspension_tem = x.temporarySuspension;
              v_suspension_def = x.definitiveSuspension;
            });
            if (v_suspension_tem || v_suspension_def) {
              this.showTable = false;
              this.settings = {
                ...this.settings,
                hideSubHeader: false,
                actions: false,
              };
              setTimeout(() => {
                this.showTable = true;
              }, 100);
            }
            this.data.load(response);
            this.dataArray = response;
            this.data.refresh();
            this.totalItems = response.length;
            if (showDates) {
              this.fillDates(response);
            }
          } else {
            // this.alert(
            //   'warning',
            //   'No hay fechas registradas en los periodos',
            //   ''
            // );
            this.data.load([]);
            this.data.refresh();
          }
        },
        error: err => {
          this.data.load([]);
          this.data.refresh();
        },
      });
  }

  private pup_block_flags(showDates = false) {
    this.notificationService
      .getStatusClasif(this.screenKey, this.good.goodClassNumber)
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response.status) {
            let { estatus, estatus_final, estatus_final2 } = response.status;
            this.DI_ESTATUS = estatus;
            this.vc_estatusfinal = estatus_final;
            this.vc_estatus_final = estatus_final2;
          }
          if (response.classif) {
            this.clasifNotification = response.classif;
            // if (
            //   this.DI_ESTATUS === this.good.status ||
            //   this.vc_estatusfinal === this.good.status ||
            //   this.vc_estatus_final === this.good.status
            // ) {
            this.period = true;
            this.periods.setValue(
              this.clasifNotification.tiempo_max_aseguramiento
            );
            this.periods1.setValue(this.clasifNotification.tiempo_max_fraccion);
            this.periods2.setValue(this.clasifNotification.tiempo_max_prorroga);

            this.MUESTRA_PERIODOS(showDates);

            // }
          }
        },
      });
  }

  get screenKey() {
    return this.type === 'D' ? 'FACTJURDECABANDEV' : 'FACTJURNOTABANASE';
  }

  private getStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', this.screenKey);
    filterParams.addFilter('status', this.good.status);
    filterParams.limit = 10000;
    return this.statusScreenService
      .getList(filterParams.getFilterParams())
      .pipe(map(x => (x.data ? x.data : [])));
  }

  private getStatusGood() {
    const filterParams = new FilterParams();
    filterParams.addFilter('status', this.good.status);
    return this.goodService.getStatus(filterParams.getFilterParams()).pipe(
      catchError(x => of({ data: [] })),
      map(x => (x.data ? x.data[0] : []))
    );
  }

  prepareForm() {
    this.buildForm();

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => {})
      )
      .subscribe();
  }

  // getGoodsxnotification() {
  //   const params = this.params.getValue();
  //   console.log(params);
  //   this.filterParams.getValue().removeAllFilters();
  //   this.filterParams.getValue().page = params.page;

  //   if (this.form.value.goodId) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('numberProperty', this.form.value.goodId, SearchFilter.EQ);
  //   }

  //   this.loading = true;
  //   this.loadingText = 'Cargando';

  //   this.notificationService
  //     .getNotificationxPropertyFilter({
  //       numberProperty: this.form.value.goodId,
  //     })
  //     .subscribe({
  //       next: response => {
  //         console.log('Goods Response: ', response);
  //         this.loading = false;
  //         this.data = response.data;

  //         this.totalItems = this.data.length;
  //         this.searching = true;
  //       },
  //       error: () => (this.loading = false),
  //     });
  // }

  // executeCamps(data: any) {
  //   this.quantity.setValue(data.quantity);
  //   const params = new FilterParams();
  //   let paramDinamyc = `filter.id=$eq:${data.goodTypeId}`;

  //   this.goodTypesService.getAllS(`${params}&${paramDinamyc}`).subscribe({
  //     next: value => {
  //       const { maxAsseguranceTime, maxFractionTime, maxExtensionTime } =
  //         value.data[0];
  //       if (
  //         maxAsseguranceTime != null &&
  //         maxFractionTime !== null &&
  //         maxExtensionTime !== null
  //       ) {
  //         this.period = true;
  //         this.periods.setValue(maxAsseguranceTime);
  //         this.periods1.setValue(maxFractionTime);
  //         this.periods2.setValue(maxExtensionTime);
  //       } else {
  //         this.onLoadToast('error', 'No existen Periodos', 'periodos vacios');
  //       }
  //     },
  //   });
  // }
  clean() {
    this.form.reset();
    this.di_permitido = false;
    this.period = false;
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
  }

  search() {
    this.postQuery();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
  public onUserRowSelect(event: any) {
    if (event.selected.length == 1) {
      this.selectedRow = event.selected[0];
    }
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  accept() {
    let filterAE = this.dataArray.filter(x => x.statusNotified === 'AE');
    let notificacion_x_bien = this.dataArray[0];
    let fecha1 = this.formatDate(
      notificacion_x_bien.notificationDate as string
    );
    let fecha2 = this.formatDate(notificacion_x_bien.periodEndDate as string);
    let fecha3 = this.formatDate(
      notificacion_x_bien.editPublicationDate as string
    );

    let body = {
      estatus: this.good.status,
      fec_notificacion: fecha1 || '',
      fec_termino_periodo: fecha2 || '',
      fec_vencimiento_abandono: fecha3 || '',
      no_bien: this.goodId.value,
      usuario: this.username,
      vc_pantalla: 'FACTJURNOTABANASE',
      changeStatusProgram: 'No manifestados',
    };

    if (filterAE.length === 3) {
      this.notificationService.validateGoodStatus(body).subscribe({
        next: response => {
          console.log('response: ', response);
          if (notificacion_x_bien.temporarySuspension) {
            this.onLoadToast(
              'warning',
              'Ir a Confirmación',
              'El proceso a sido suspendido temporalmente'
            );
            this.clean();
          } else {
            this.onLoadToast(
              'success',
              'Guardado',
              'Registros actualizados exitosamente'
            );
          }
        },
        error: err => {
          console.log('err: ', err);
          this.onLoadToast(
            'error',
            'Error',
            'Hubo un error actualizando la base de datos'
          );
          this.clean();
        },
      });
    } else if (filterAE.length < 3) {
      this.onLoadToast(
        'error',
        'Error',
        'Deben haber 3 notificaciones de aseguramiento para confirmar'
      );
    }
  }

  onSelectedGood(event: any) {
    this.selectedGood = event;
  }

  getUserInfo() {
    return this.programmingRequestService.getUserInfo().subscribe({
      next: (data: any) => {
        console.log(data);
        this.username = data.username;
      },
      error: error => {
        error;
      },
    });
  }
}
