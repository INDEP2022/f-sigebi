import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITvaltables1 } from 'src/app/core/models/catalogs/tvaltable-model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ButtonSelectComponent } from '../components/button-select/button-select.component';
import { ButtonViewComponent } from '../components/button-select/button-view.component';
import { ViewAtributeGoodModalComponent } from '../components/view-atribute-good-modal/view-atribute-good-modal.component';
import { GOODS_COLUMNS, NOTIFICATIONS_COLUMNS } from './columns';
enum TypeFilter {
  fileNumber = 'fileNumber',
  flierNumber = 'flierNumber',
  previousSearch = 'previousSearch',
  penalCause = 'penalCause',
  receptionDate = 'receptionDate',
  amparoKey = 'amparoKey',
  penalTouchKey = 'penalTouchKey',
  extJobDate = 'extJobDate',
  extJobKey = 'extJobKey',
}
@Component({
  selector: 'app-records-tracker',
  templateUrl: './records-tracker.component.html',
  styleUrls: ['./records-tracker.component.scss'],
})
export class RecordsTrackerComponent extends BasePage implements OnInit {
  @ViewChild('scrollTable') scrollTable: ElementRef<HTMLDivElement>;
  form: FormGroup;
  select = new DefaultSelect();
  notificationselect = new DefaultSelect();
  fileNumberselect = new DefaultSelect();
  flierNumberselect = new DefaultSelect();
  previousSearchselect = new DefaultSelect();
  penalCauseselect = new DefaultSelect();
  receptionDateselect = new DefaultSelect();
  amparoKeyselect = new DefaultSelect();
  penalTouchKeyselect = new DefaultSelect();
  extJobDateselect = new DefaultSelect();
  extJobKeyselect = new DefaultSelect();
  minsPublic = new DefaultSelect();
  entsFed = new DefaultSelect();
  columnFilters: any = [];
  columnFiltersGoods: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsGood: number = 0;
  data: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  loadingGood: boolean = this.loading;
  settingsNotifications = this.settings;
  settingsGood = this.settings;
  showTable: boolean = false;
  consulto: boolean = false;
  notificationSelect: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private minPubService: MinPubService,
    private entFedService: EntFedService,
    private goodService: GoodService,
    private location: Location,
    private tvalTable1Service: TvalTable1Service,
    private modalService: BsModalService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();

    this.settingsNotifications = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        acciones: {
          title: 'Acciones',
          type: 'custom', // Indicamos que esta columna utilizará un componente personalizado
          sort: false,
          filter: false,
          with: '20%',
          renderComponent: ButtonSelectComponent, // Nombre del componente personalizado que mostrará el botón
          onComponentInitFunction: (instance: any) => {
            instance.someClick.subscribe((row: any) => {
              this.selectAndExit(row);
            });
            instance.viewGood.subscribe((row: any) => {
              this.selectNotification(row);
            });
          },
        },
        ...NOTIFICATIONS_COLUMNS,
      },
    };

    this.settingsGood = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        acciones: {
          title: 'Acciones',
          type: 'custom', // Indicamos que esta columna utilizará un componente personalizado
          sort: false,
          filter: false,
          with: '20%',
          renderComponent: ButtonViewComponent, // Nombre del componente personalizado que mostrará el botón
          onComponentInitFunction: (instance: any) => {
            instance.someClick.subscribe((row: any) => {
              this.viewAtributeGood(row);
            });
          },
        },
        ...GOODS_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.initForms();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consulto) this.getNotificationsTable();
    });
    this.paramsGood.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.notificationSelect)
        this.getGoodsTable(this.notificationSelect.expedientNumber);
    });
    this.getDistinct(new ListParams(), TypeFilter.fileNumber);
    this.getDistinct(new ListParams(), TypeFilter.flierNumber);
    this.getDistinct(new ListParams(), TypeFilter.previousSearch);
    this.getDistinct(new ListParams(), TypeFilter.penalCause);
    this.getDistinct(new ListParams(), TypeFilter.receptionDate);
    this.getDistinct(new ListParams(), TypeFilter.amparoKey);
    this.getDistinct(new ListParams(), TypeFilter.penalTouchKey);
    this.getDistinct(new ListParams(), TypeFilter.extJobDate);
    this.getDistinct(new ListParams(), TypeFilter.extJobKey);
    this.getMinsPublic(new ListParams());
  }

  initForms() {
    this.form = this.fb.group({
      noExpediente: [null],
      averPrevia: [null],
      causaPenal: [null],
      noVolante: [null],
      indiciado: [null],
      fechaRec: [null],
      amparo: [null],
      tocaPenal: [null],
      noJuzgado: [null],
      fechaOficio: [null],
      minPub: [null],
      oficioExterno: [null],
      entFed: [null],
      cveEntFed: [null],
    });
  }

  getNotifications(params?: ListParams) {
    params['filter.protectionKey'] = `$ilike:a`;
    this.notificationService.getAll(params).subscribe({
      next: resp => {
        const data = resp.data.map(element => {
          return {
            ...element,
            externalOfficeDate: element.externalOfficeDate
              .toString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/'),
            receiptDate: element.receiptDate
              .toString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/'),
          };
        });
        console.log(data);
        this.notificationselect = new DefaultSelect(data, resp.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.notificationselect = new DefaultSelect();
      },
    });
  }

  getMinsPublic(params?: ListParams) {
    this.minPubService.getAll(params).subscribe({
      next: response => {
        this.minsPublic = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.minsPublic = new DefaultSelect();
      },
    });
  }

  getEntFed(params?: ListParams) {
    this.entFedService.getAll(params).subscribe({
      next: response => {
        this.entsFed = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.entsFed = new DefaultSelect();
      },
    });
  }

  onNotificationChange(event: any) {
    console.log(event);
  }

  onMinsPublicChange(event: any) {
    console.log(event);
  }

  consult() {
    this.consulto = true;
    this.showTable = true;
    if (this.form.controls['noExpediente'].value !== null) {
      this.params.value.page = 1;
      this.params.getValue()[
        'filter.expedientNumber'
      ] = `$eq:${this.form.controls['noExpediente'].value}`;
    } else {
      this.params.getValue()['filter.expedientNumber'] = '$not:$null';
      if (this.form.get('averPrevia').value !== null) {
        this.params.getValue()['filter.preliminaryInquiry'] = `$ilike:${
          this.form.get('averPrevia').value
        }}`;
      } else {
        delete this.params.getValue()['filter.preliminaryInquiry'];
      }
      if (this.form.get('causaPenal').value !== null) {
        this.params.getValue()['filter.criminalCase'] = `$ilike:${
          this.form.get('causaPenal').value
        }`;
      } else {
        delete this.params.getValue()['filter.criminalCase'];
      }
      if (this.form.get('indiciado').value !== null) {
        this.params.getValue()['filter.versionUser'] = `$ilike:${
          this.form.get('indiciado').value
        }`;
      } else {
        delete this.params.getValue()['filter.versionUser'];
      }
      if (this.form.get('entFed').value !== null) {
        this.params.getValue()['filter.entFedKey'] = `$eq:${
          this.form.get('cveEntFed').value
        }`;
      } else {
        delete this.params.getValue()['filter.entFedKey'];
      }
      if (this.form.get('minPub').value !== null) {
        this.params.getValue()['filter.minpubNumber'] = `$eq:${
          this.form.get('minPub').value
        }`;
      } else {
        delete this.params.getValue()['filter.minpubNumber'];
      }
      if (this.form.get('oficioExterno').value !== null) {
        this.params.getValue()['filter.institutionNumber'] = `$eq:${
          this.form.get('oficioExterno').value
        }`;
      } else {
        delete this.params.getValue()['filter.institutionNumber'];
      }
      if (this.form.get('fechaRec').value !== null) {
        this.params.getValue()['filter.receiptDate'] = `$eq:${
          this.form.get('fechaRec').value
        }`;
      } else {
        delete this.params.getValue()['filter.receiptDate'];
      }
      if (this.form.get('fechaOficio').value !== null) {
        this.params.getValue()['filter.externalOfficeDate'] = `$eq:${
          this.form.get('fechaOficio').value
        }`;
      } else {
        delete this.params.getValue()['filter.externalOfficeDate'];
      }
      if (this.form.get('noJuzgado').value !== null) {
        this.params.getValue()['filter.courtNumber'] = `$eq:${
          this.form.get('noJuzgado').value
        }`;
      } else {
        delete this.params.getValue()['filter.courtNumber'];
      }
      if (this.form.get('amparo').value !== null) {
        this.params.getValue()['filter.protectionKey'] = `$eq:${
          this.form.get('amparo').value
        }`;
      } else {
        delete this.params.getValue()['filter.protectionKey'];
      }
      if (this.form.get('tocaPenal').value !== null) {
        this.params.getValue()['filter.touchPenaltyKey'] = `$eq:${
          this.form.get('tocaPenal').value
        }`;
      } else {
        delete this.params.getValue()['filter.touchPenaltyKey'];
      }
      if (this.form.get('noVolante').value !== null) {
        this.params.getValue()['filter.wheelNumber'] = `$eq:${
          this.form.get('noVolante').value
        }`;
      } else {
        delete this.params.getValue()['filter.wheelNumber'];
      }
    }
    this.getNotificationsTable();
    this.scrollTable.nativeElement.scrollIntoView();
  }

  clean() {
    delete this.params.getValue()['filter.preliminaryInquiry'];
    delete this.params.getValue()['filter.criminalCase'];
    delete this.params.getValue()['filter.versionUser'];
    delete this.params.getValue()['filter.entFedKey'];
    delete this.params.getValue()['filter.minpubNumber'];
    delete this.params.getValue()['filter.institutionNumber'];
    delete this.params.getValue()['filter.receiptDate'];
    delete this.params.getValue()['filter.externalOfficeDate'];
    delete this.params.getValue()['filter.courtNumber'];
    delete this.params.getValue()['filter.protectionKey'];
    delete this.params.getValue()['filter.touchPenaltyKey'];
    delete this.params.getValue()['filter.wheelNumber'];

    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.showTable = false;
  }

  getNotificationsTable() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.notificationService.getAll(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getGoodsTable(fileNumber: number | string) {
    this.loadingGood = true;
    let params = {
      ...this.paramsGood.getValue(),
      ...this.columnFiltersGoods,
    };
    params['filter.fileNumber'] = `$eq:${fileNumber}`;
    this.goodService.getAll(params).subscribe({
      next: async resp => {
        const params: ListParams = {};
        const data = await Promise.all(
          resp.data.map(async element => {
            const type: any = await this.getClassif(
              params,
              element.goodClassNumber
            );
            console.log(type);
            return {
              ...element,
              typeDescription: type.numType.nameGoodType,
              subTypeDescription: type.numSubType.nameSubtypeGood,
              ssubTypeDescription: type.numSsubType.description,
              sssubTypeDescription: type.description,
            };
          })
        );
        console.log(data);
        this.dataGood.load(data);
        this.dataGood.refresh();
        this.totalItemsGood = resp.count;
        this.loadingGood = false;
      },
      error: err => {
        this.dataGood.load([]);
        this.dataGood.refresh();
        this.totalItemsGood = 0;
        this.loadingGood = false;
      },
    });
  }

  selectNotification(event: any) {
    this.notificationSelect = event;
    console.log(event);
    this.getGoodsTable(event.expedientNumber);
  }

  selectAndExit(event: any) {
    localStorage.setItem(
      'numberExpedientTracker',
      JSON.stringify(event.expedientNumber)
    );
    console.log(event);
    this.location.back();
  }

  async onEntidadChange(event: any) {
    console.log(event);
    if (event) {
      let vc_ent: string = '';
      const data = await this.getTValTable1();
      console.log(data);
      data.forEach(element => {
        vc_ent = vc_ent + element.otkey;
      });
      this.form.get('cveEntFed').setValue(vc_ent);
      console.log(vc_ent);
    }
  }

  getTValTable1() {
    return new Promise<ITvaltables1[]>((resolve, reject) => {
      const params: ListParams = {};
      params['filter.nmtable'] = `$eq:1`;
      //params['filter.otvalor'] = `$eq:`;
      this.tvalTable1Service.getAlls(params).subscribe({
        next: resp => {
          resolve(resp.data);
        },
        error: err => {
          reject([]);
        },
      });
    });
  }

  getDistinct(params: ListParams, name: string) {
    const model: any = {};
    switch (name) {
      case TypeFilter.fileNumber:
        params['filter.no_expediente'] = `$eq:${params.text}`;
        model[TypeFilter.fileNumber] = true;
        break;
      case TypeFilter.flierNumber:
        params['filter.no_volante'] = `$eq:${params.text}`;
        model[TypeFilter.flierNumber] = true;
        break;
      case TypeFilter.previousSearch:
        params['filter.averiguacion_previa'] = `$ilike:${params.text}`;
        model[TypeFilter.previousSearch] = true;
        break;
      case TypeFilter.penalCause:
        params['filter.causa_penal'] = `$ilike:${params.text}`;
        model[TypeFilter.penalCause] = true;
        break;
      case TypeFilter.receptionDate:
        params['filter.fec_recepcion'] = `$ilike:${params.text}`;
        model[TypeFilter.receptionDate] = true;
        break;
      case TypeFilter.amparoKey:
        params['filter.amparo_key'] = `$ilike:${params.text}`;
        model[TypeFilter.amparoKey] = true;
        break;
      case TypeFilter.penalTouchKey:
        params['filter.penal_touch_key'] = `$ilike:${params.text}`;
        model[TypeFilter.penalTouchKey] = true;
        break;
      case TypeFilter.extJobDate:
        params['filter.fec_oficio_externo'] = `$ilike:${params.text}`;
        model[TypeFilter.extJobDate] = true;
        break;
      case TypeFilter.extJobKey:
        params['filter.oficio_externo_key'] = `$eq:${params.text}`;
        model[TypeFilter.extJobKey] = true;
        break;
      default:
        return;
    }

    console.log(model);
    this.notificationService.getDistinct(params, model).subscribe({
      next: response => {
        console.log(response.data);
        switch (name) {
          case TypeFilter.fileNumber:
            this.fileNumberselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.flierNumber:
            this.flierNumberselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.previousSearch:
            this.previousSearchselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.penalCause:
            this.penalCauseselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.receptionDate:
            this.receptionDateselect = new DefaultSelect(
              response.data.map(x => {
                return {
                  fec_recepcion: x.fec_recepcion
                    ? x.fec_recepcion
                        .toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                };
              }),
              response.count
            );
            break;
          case TypeFilter.amparoKey:
            this.amparoKeyselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.penalTouchKey:
            this.penalTouchKeyselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          case TypeFilter.extJobDate:
            this.extJobDateselect = new DefaultSelect(
              response.data.map(x => {
                return {
                  fec_oficio_externo: x.fec_oficio_externo
                    ? x.fec_oficio_externo
                        .toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/')
                    : '',
                };
              }),
              response.count
            );
            break;
          case TypeFilter.extJobKey:
            this.extJobKeyselect = new DefaultSelect(
              response.data,
              response.count
            );
            break;
          default:
            return;
        }
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.entsFed = new DefaultSelect();
      },
    });
  }

  viewAtributeGood(good: IGood) {
    const classificationOfGoods: number = Number(good.goodClassNumber);
    let config: ModalOptions = {
      initialState: {
        good,
        classificationOfGoods,
        /* callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getBanks());
          }
        }, */
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ViewAtributeGoodModalComponent, config);
  }

  async getClassif(params: ListParams, id: string | number) {
    return new Promise<any>((res, rej) => {
      const _params: any = params;
      _params['filter.numClasifGoods'] = id;
      delete _params.search;
      delete _params.text;
      console.log(_params);
      this.goodSssubtypeService.getAll(_params).subscribe({
        next: data => {
          res(data.data[0]);
        },
        error: error => {
          res(null);
        },
      });
    });
  }
}
