import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { GoodTrackerEndpoints } from 'src/app/common/constants/endpoints/ms-good-tracker-endpoints';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SocketService } from 'src/app/common/socket/socket.service';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { FullService } from 'src/app/layouts/full/full.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { environment } from 'src/environments/environment';
import {
  SetTrackedGoods,
  SetTrackerFilter,
} from '../../store/goods-tracker.actions';
import {
  getTrackedGoods,
  getTrackerFilter,
} from '../../store/goods-tracker.selector';
import {
  GOOD_TRACKER_ORIGINS,
  GOOD_TRACKER_ORIGINS_TITLES,
} from '../../utils/constants/origins';
import { GoodTrackerMap } from '../../utils/good-tracker-map';
import { ActaHistoComponent } from '../acta-histo/acta-histo.component';
import { GTrackerDocumentsComponent } from '../g-tracker-documents/g-tracker-documents.component';
import { GoodsTableService } from './goods-table.service';

@Component({
  selector: 'goods-table',
  templateUrl: './goods-table.component.html',
  styles: [
    `
      .text-black {
        color: black;
      }
    `,
  ],
})
export class GoodsTableComponent extends BasePage implements OnInit {
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  goodsList: ITrackedGood[] = [];

  @Input() set goods(good: ITrackedGood[]) {
    if (good.length > 0) {
      this.goodsList = good;
      this.setterColorRow();
    } else {
      this.goodsList = [];
    }
  }
  @Input() formCheckbox: FormGroup;

  get goods(): ITrackedGood[] {
    return this.goodsList;
  }
  @Input() totalItems: number = 0;
  @Input() params: BehaviorSubject<ListParams>;
  @Input() override loading: boolean = false;
  @Input() formData: FormGroup;
  @Input() fomrCheck: FormGroup;
  @Input() filters: GoodTrackerMap;

  @Input() selectedGooods: ITrackedGood[] = [];
  origin: string = null;
  ngGlobal: any = null;
  $trackedGoods = this.store.select(getTrackedGoods);
  $trackerFilter = this.store.select(getTrackerFilter);
  includeLoading: boolean = false;
  includeAllLoading: boolean = false;
  excelLoading: boolean = false;
  showInclude = false;

  saveState = false;

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router,
    private location: Location,
    private goodsTableService: GoodsTableService,
    private documentsService: DocumentsService,
    private proceedingService: ProceedingsService,
    private goodTrackerService: GoodTrackerService,
    private globalVarService: GlobalVarsService,
    private jasperServ: SiabService,
    private goodPartService: GoodPartializeService,
    private procedings: ProceedingsService,
    private partializeGoodServ: PartializeGoodService,
    private photoService: PublicationPhotographsService,
    private socketService: SocketService,
    private fullService: FullService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = this.goodsTableService.columns;
    this.settings.rowClassFunction = (row: any) =>
      row.data.socialCabite ? 'bg-success text-black' : '';
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: params => {
          const origin = params['origin'];
          this.origin = origin;
          this.setColumnsFromOrigin();
        },
      });
  }

  setterColorRow(ev?: any) {
    setTimeout(() => {
      const table = document.getElementById('t-rastreador');
      const thead = table.children[0].children[0].children[0].children;
      const tbody = table.children[0].children[1].children;
      for (let i = 0; i < tbody.length; i++) {
        const cell = tbody[i].children;
        for (let x = 0; x < cell.length; x++) {
          const th = thead[x].classList[thead[x].classList.length - 1];
          const tr = cell[x];
          tr.classList.add(th.includes('bg-') ? th : 'x');
        }
      }
    }, 300);
  }

  setColumnsFromOrigin() {
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        name: {
          title: 'Selección',
          sort: false,
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: ITrackedGood) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
        ...this.goodsTableService.columns,
      },
    };
    if (this.isValidOrigin()) {
      this.showInclude = true;
    } else {
      this.showInclude = false;
    }
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: ITrackedGood) {
    const exists = this.selectedGooods.find(
      good => good.goodNumber == _good.goodNumber
    );
    return exists ? true : false;
  }

  private isValidOrigin() {
    return (
      this.origin !== null &&
      Object.values(GOOD_TRACKER_ORIGINS).includes(
        this.origin as unknown as GOOD_TRACKER_ORIGINS
      )
    );
  }

  goodSelectedChange(good: ITrackedGood, selected: boolean) {
    if (selected) {
      good.select = true;
      this.selectedGooods.push(good);
    } else {
      good.select = false;
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.goodNumber != good.goodNumber
      );
    }
    if (this.isValidOrigin()) {
      this.store.dispatch(
        SetTrackedGoods({ trackedGoods: this.selectedGooods })
      );
    }
    this.$trackedGoods.pipe(take(1)).subscribe(obs => {
      console.log(obs);
    });
  }

  async ngOnInit() {
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe), take(1))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
        },
      });

    this.$unSubscribe.subscribe({
      complete: () => this.saveFilterState(),
    });

    this.goodsTableService.stateFlag
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => {
          this.saveState = true;
        })
      )
      .subscribe();
  }

  saveFilterState() {
    if (this.saveState) {
      this.store.dispatch(SetTrackerFilter({ trackerFilter: this.formData }));
    }
  }

  async viewImages() {
    if (!this.selectedGooods.length) {
      this.alert('error', 'Error', 'Primero Selecciona un Registro');
      return;
    }

    if (this.selectedGooods.length > 1) {
      await this.alertInfo(
        'warning',
        'Más de un Registro Seleccionado',
        'Se tomará el último registro seleccionado'
      );
    }
    const selectedGood = this.selectedGooods.at(-1);
    if (!selectedGood.fileNumber) {
      this.alert('error', 'Error', 'Este Trámite no tiene Volante Asignado');
      return;
    }

    await this.getDocuments(selectedGood);
  }

  async getDocuments(trackedGood: ITrackedGood) {
    let config = {
      initialState: {
        trackedGood,
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    const count = await this.countAct(trackedGood.goodNumber);
    if (count > 0) {
      this.modalService.show(GTrackerDocumentsComponent, config);
    } else {
      await this.otDocuments(trackedGood);
    }
  }

  countAct(goodNumber: number | string) {
    return firstValueFrom(
      this.proceedingService.getCountActas(goodNumber).pipe(
        catchError(error => {
          return of({ data: [{ count: 0 }] });
        }),
        map(res => res.data[0].count ?? 0)
      )
    );
  }

  async otDocuments(trackedGood: ITrackedGood) {
    console.log('ot docs');

    const params = new FilterParams();
    params.addFilter('numberProceedings', trackedGood.fileNumber);
    const documents = await this.getDocumentsFilter(params);
    if (documents.count == 0) {
      this.alert('error', 'Error', 'No existen Documentos para el Expediente');
    } else if (documents.count == 1) {
      const d = await this.getOtDocs(trackedGood.fileNumber);
      if (!d.data.length) {
        await this.defaultDocuments(trackedGood);
      }
      const { folio_universal, id_medio } = d.data[0];
      if (folio_universal > 0) {
        await this.defaultDocuments(trackedGood);
      } else {
        await this.defaultDocuments(trackedGood);
      }
    } else {
      await this.defaultDocuments(trackedGood);
    }
  }

  satDocs() {}

  async defaultDocuments(trackedGood: ITrackedGood) {
    const params = new FilterParams();
    params.addFilter('numberProceedings', trackedGood.fileNumber);
    const response = await this.getDocumentsFilter(params);
    if (response.count == 0) {
      this.alert('error', 'Error', 'No tiene Documentos Digitalizados');
      return;
    }
    const byExpedient = true;
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        trackedGood,
        byExpedient,
      },
    };
    this.modalService.show(GTrackerDocumentsComponent, config);
  }

  getOtDocs(expedient: string | number) {
    return firstValueFrom(
      this.documentsService.otDocuments(expedient).pipe(
        catchError(() => {
          return of({ data: [], count: 0 });
        })
      )
    );
  }

  getDocumentsFilter(params: FilterParams) {
    return firstValueFrom(
      this.documentsService.getAllFilter(params.getParams()).pipe(
        catchError(() => {
          return of({ data: [], count: 0 });
        })
      )
    );
  }

  async takeOneProcess(turnSelects: any) {
    await this.alertInfo(
      'warning',
      'Más de un trámite seleccionado',
      'Se tomará el último Registro Seleccionado'
    );
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  viewPhotos() {
    if (this.ngGlobal.bienes_foto >= 2) {
      this.alertQuestion(
        'question',
        '¿Desea visualizar las Fotos de todos los Bienes?',
        ''
      ).then(answ => {
        if (answ.isConfirmed) {
          this.saveState = true;
          this.router.navigate(['pages/general-processes/good-photos'], {
            queryParams: {
              photo: 'S',
              origin: 'FCONGENRASTREADOR',
            },
          });
        } else {
          const good = this.selectedGooods;
          if (good.length) {
            if (good[0].goodNumber) {
              this.saveState = true;
              this.router.navigate(['pages/general-processes/good-photos'], {
                queryParams: {
                  numberGood: good[0].goodNumber,
                  origin: 'FCONGENRASTREADOR',
                },
              });
            }
          } else {
            this.alert(
              'warning',
              'Visualizar Fotos',
              'Debe Seleccionar un Bien',
              ''
            );
          }
        }
      });
    } else {
      const good = this.selectedGooods;
      if (good.length) {
        if (good[0].goodNumber) {
          this.saveState = true;
          this.router.navigate(['pages/general-processes/good-photos'], {
            queryParams: {
              numberGood: good[0].goodNumber,
              origin: 'FCONGENRASTREADOR',
            },
          });
        }
      } else {
        this.alert(
          'warning',
          'Visualizar Fotos',
          'Debe Seleccionar un Bien',
          ''
        );
      }
    }
  }

  backToText() {
    if (this.isValidOrigin()) {
      return GOOD_TRACKER_ORIGINS_TITLES[this.origin as GOOD_TRACKER_ORIGINS];
    }
    return '';
  }

  backTo() {
    if (this.origin == GOOD_TRACKER_ORIGINS.GoodsLocation) {
      this.saveState = true;
      this.router.navigate(['/pages/administrative-processes/location-goods']);
      return;
    }

    if (this.origin == GOOD_TRACKER_ORIGINS.DestructionManagement) {
      this.saveState = true;
      this.router.navigate([
        '/pages/executive-processes/destruction-authorization-management',
      ]);
      return;
    }
    if (this.origin == GOOD_TRACKER_ORIGINS.ProofDelivery) {
      this.saveState = true;
      this.router.navigate([
        '/pages/final-destination-process/proof-of-delivery',
      ]);
      return;
    }
    this.location.back();
  }

  include() {
    if (this.selectedGooods.length == 0) {
      this.onLoadToast('warning', 'Debe seleccionar al menos un bien', '');
      return;
    }
    const goodIds = this.selectedGooods.map(good => good.goodNumber);
    this.includeLoading = true;
    this.getTmpNextVal()
      .pipe(
        switchMap(identificator => {
          const $obs = goodIds.map(goodNumber =>
            this.saveTmpGood(identificator, goodNumber)
          );
          return forkJoin($obs).pipe(map(() => identificator));
        })
      )
      .subscribe({
        next: identificator => {
          this.includeLoading = false;
          this.ngGlobal.REL_BIENES = identificator;
          this.globalVarService.updateGlobalVars(this.ngGlobal);
          this.backTo();
        },
        error: error => {
          this.includeLoading = false;
          this.onLoadToast('error', 'Error', 'Ocurrió un error');
        },
      });
  }

  includeAll() {
    this.includeAllLoading = true;
    this.getTmpNextVal()
      .pipe(
        switchMap(identifier =>
          this.goodTrackerService
            .includeAll({
              ...this.filters,
              identifier,
            })
            .pipe(map(() => identifier))
        )
      )
      .subscribe({
        next: identificator => {
          this.includeAllLoading = false;
          this.ngGlobal.REL_BIENES = identificator;
          this.globalVarService.updateGlobalVars(this.ngGlobal);
          this.backTo();
        },
        error: error => {
          this.includeAllLoading = false;
          this.onLoadToast('error', 'Error', 'Ocurrió un error');
        },
      });
  }

  saveTmpGood(identificator: number, goodNumber: number | string) {
    return this.goodTrackerService.createTmpTracker({
      identificator,
      goodNumber: Number(goodNumber),
    });
  }

  getTmpNextVal() {
    return this.goodTrackerService.getIdentifier().pipe(
      catchError(error => {
        this.onLoadToast('error', 'Error', 'Ocurrió un error');
        return throwError(() => error);
      }),
      map((response: any) => response.nextval)
    );
  }

  async viewImgDataSheet() {
    let lst_good: string = '';

    const { lookPhoto } = this.fomrCheck.value;

    if (lookPhoto) {
      this.alert('warning', 'De Doble Clic sobre la Foto', '');
    } else {
      await this.getTem();

      this.selectedGooods.map(async good => {
        if (good.select) {
          lst_good = lst_good + `${good.goodNumber},`;
          await this.insertListPhoto(Number(good.goodNumber));
          if (lst_good.length > 3600) {
            lst_good = lst_good.substring(0, lst_good.length - 1);
            await this.insertListPhoto(Number(good.goodNumber));
            lst_good = '';
          }
        }
      });

      if (this.selectedGooods.length > 1) {
        lst_good = lst_good.substring(0, lst_good.length - 1);
        this.insertListPhoto(Number(lst_good));
        this.callReport(null, this.ngGlobal);
      } else {
        if (this.selectedGooods.length > 0) {
          this.insertListPhoto(Number(this.selectedGooods[0].goodNumber));
          this.callReport(Number(this.selectedGooods[0].goodNumber), null);
        } else {
          this.alert('error', 'Error', 'Se Requiere de al menos un Bien');
        }
      }
    }
  }

  async getTem() {
    return new Promise((resolve, reject) => {
      this.getTmpNextVal().subscribe({
        next: resp => {
          this.ngGlobal.REL_BIENES = resp;
          this.globalVarService.updateGlobalVars(this.ngGlobal);
          resolve(resp);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  insertListPhoto(goodNumber: number) {
    return firstValueFrom(
      this.photoService
        .pubPhoto({
          pcNoGood: goodNumber,
          lNuNoGood: goodNumber,
        })
        .pipe(
          catchError(err => of(false)),
          map(res => true)
        )
    );
  }

  async callReport(lnu_good: number, lnu_identificador: number) {
    if (lnu_identificador) {
      this.jasperServ
        .fetchReport('FICHATECNICA', {
          P_NO_BIEN: lnu_good,
          P_IDENTIFICADOR: lnu_identificador,
        })
        .pipe(
          tap(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          })
        )
        .subscribe();
    } else {
      const v_parcialization = await this.getPadre(lnu_good);

      // if (!v_parcialization) return;

      this.jasperServ
        .fetchReport('RCEDINFCONNUMERARIO' /*'RCEDINFCONNUMERARIO'*/, {
          P_NO_BIEN: lnu_good,
          P_IDENTIFICADOR: v_parcialization,
        })
        .pipe(
          tap(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          })
        )
        .subscribe();
    }
  }

  async getPadre(good: number) {
    return new Promise((resolve, reject) => {
      this.goodPartService.getByGoodNumber(good).subscribe({
        next: resp => {
          console.log(resp);
          resolve(null);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getHistory() {
    if (!this.selectedGooods.length) {
      this.alert('warning', 'Debe Seleccionar un Bien', '');
      return;
    }
    if (this.selectedGooods.length > 1) {
      this.alert('warning', 'Debe Seleccionar solo un Bien', '');
      return;
    }
    const good = this.selectedGooods[0];

    const histo = await this.getHistoryData(Number(good.goodNumber));

    if (histo.length > 0) {
      let config: ModalOptions = {
        initialState: {
          histo: histo,
          callback: (data: any) => {},
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ActaHistoComponent, config);
    } else {
      this.alert(
        'warning',
        `Bien: ${good.goodNumber}`,
        'No tiene Actas, Programaciones, Suspensiones ni Cancelaciones'
      );
    }
  }

  async getHistoryData(good: number) {
    return new Promise<any[]>((resolve, reject) => {
      this.procedings.getUnioTable(good).subscribe({
        next: resp => {
          resolve(resp.data);
        },
        error: () => {
          resolve([]);
        },
      });
    });
  }

  async certificateSell() {
    const goods = this.selectedGooods;

    if (goods.length > 0) {
      if (goods.length > 1) {
        this.alertQuestion(
          'warning',
          '',
          'Se tiene varios Bienes Seleccionados se tomará el último',
          ''
        ).then(async answ => {
          if (answ.isConfirmed) {
            const good = goods[goods.length - 1];
            const v_entra = await this.getExist(Number(good.goodNumber));
            if (v_entra > 0) {
              this.callReport(Number(good.goodNumber), 1);
            } else {
              await this.partializePaGood(Number(good.goodNumber));
              this.callReport(Number(good.goodNumber), 1);
            }
          }
        });
      } else {
        const good = goods[0];
        const v_entra = await this.getExist(Number(good.goodNumber));
        if (v_entra > 0) {
          this.callReport(Number(good.goodNumber), 1);
        } else {
          await this.partializePaGood(Number(good.goodNumber));
          this.callReport(Number(good.goodNumber), 1);
        }
      }
    } else {
      this.alert('error', 'Error', 'Se Requiere un Bien');
    }
  }

  async getExist(good: number) {
    return new Promise<number>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('goodNumber', good, SearchFilter.EQ);
      this.partializeGoodServ.getAll(filter.getParams()).subscribe({
        next: resp => {
          resolve(resp.count);
        },
        error: () => {
          resolve(0);
        },
      });
    });
  }

  async partializePaGood(good: number) {
    return new Promise<boolean>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('goodNumber', good, SearchFilter.EQ);
      this.partializeGoodServ.partializePaGood(good).subscribe({
        next: resp => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  subscribeExcel(token: string) {
    console.log(token);

    return this.socketService.goodsTrackerExcel(token).pipe(
      take(1),
      catchError(error => {
        return throwError(() => error);
      }),
      tap(res => {
        console.warn('RESPUESTA DEL SOCKET');
        console.log({ res });
        this.getExcel(token);
      })
      // switchMap(() => )
    );
  }

  subscribePhotos(token: string) {
    return this.socketService.exportGoodsTrackerPhotos(token).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      tap((res: any) => {
        this.fullService.generatingFileFlag.next({
          progress: res.percent,
          showText: true,
        });
        if (res.percent == 100 && res.path) {
          this.alert('success', 'Archivo Descargado Correctamente', '');
          const url = `${environment.API_URL}ldocument/${environment.URL_PREFIX}${res.path}`;
          console.log({ url });
          window.open(url, '_blank');
        }
      }),
      takeWhile((res: any) => res.percent <= 100 && !res.path)
    );
  }

  getExcel(token: string) {
    this.alert('success', 'Archivo Descargado Correctamente', '');
    const url = `${environment.API_URL}trackergood/${environment.URL_PREFIX}${GoodTrackerEndpoints.DownloadExcel}/${token}`;
    console.log({ url });
    window.open(url, '_blank');
    // this.downloadExcel(resp.file);
    this.fullService.generatingFileFlag.next({
      progress: 100,
      showText: true,
    });
    // return this.goodTrackerService.donwloadExcel(token).pipe(
    //   // catchError(error => {
    //   //   this.alert('error', 'Error', 'No se Generó Correctamente el Archivo');
    //   //   this.fullService.generatingFileFlag.next({
    //   //     progress: 100,
    //   //     showText: true,
    //   //   });
    //   //   return throwError(() => error);
    //   // }),
    //   tap(resp => {
    //     console.warn('excel');

    //     console.log(resp);
    //   })
    // );
  }

  downloadExcel(base64String: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = 'Rastreador_Bienes.csv';
    link.click();
    link.remove();
    this.alert('success', 'Archivo Descargado Correctamente', '');
  }

  getDataExcell() {
    this.excelLoading = true;
    this.goodTrackerService.getExcel(this.filters).subscribe({
      next: resp => {
        this.excelLoading = false;
        this.alert(
          'warning',
          'El archivo excel está en proceso de generación, favor de esperar la descarga',
          ''
        );
        this.fullService.generatingFileFlag.next({
          progress: 99,
          showText: true,
        });
        this.subscribeExcel(resp.token).subscribe();
      },
      error: () => {
        this.excelLoading = false;
        this.alert('error', 'Error', 'No se Generó Correctamente el Archivo');
      },
    });
  }

  getPhotos() {
    this.goodTrackerService.getPhotos(this.filters).subscribe({
      next: res => {
        this.alert(
          'warning',
          'La Descarga está en Proceso, favor de Esperar',
          ''
        );
        const $sub = this.subscribePhotos(res.token).subscribe();
      },
      error: error => {
        console.log(error);
      },
    });
  }
}
