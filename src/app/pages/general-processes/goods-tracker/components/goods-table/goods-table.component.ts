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
  tap,
  throwError,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { PartializeGoodService } from 'src/app/core/services/ms-partializate-good/partializate-good.service';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { SetTrackedGoods } from '../../store/goods-tracker.actions';
import { getTrackedGoods } from '../../store/goods-tracker.selector';
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
  styles: [],
})
export class GoodsTableComponent extends BasePage implements OnInit {
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  @Input() goods: ITrackedGood[] = [];
  @Input() totalItems: number = 0;
  @Input() params: BehaviorSubject<ListParams>;
  @Input() override loading: boolean = false;
  @Input() formData: FormGroup;
  @Input() fomrCheck: FormGroup;
  @Input() filters: GoodTrackerMap;

  private selectedGooods: ITrackedGood[] = [];
  origin: string = null;
  ngGlobal: any = null;
  $trackedGoods = this.store.select(getTrackedGoods);
  includeLoading: boolean = false;
  excelLoading: boolean = false;

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
    private partializeGoodServ: PartializeGoodService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = this.goodsTableService.columns;
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

  setColumnsFromOrigin() {
    if (this.isValidOrigin()) {
      this.settings = {
        ...this.settings,
        actions: false,
        columns: {
          name: {
            title: '',
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
      this.selectedGooods.push(good);
    } else {
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

  ngOnInit(): void {
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe), take(1))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
        },
      });
  }

  async viewImages() {
    if (!this.selectedGooods.length) {
      this.alert('error', 'Error', 'Primero selecciona un registro');
      return;
    }

    if (this.selectedGooods.length > 1) {
      await this.alertInfo(
        'info',
        'Más de un registro seleccionado',
        'Se tomará el último registro seleccionado'
      );
    }
    const selectedGood = this.selectedGooods.at(-1);
    if (!selectedGood.fileNumber) {
      this.alert('error', 'Error', 'Este trámite no tiene volante asignado');
      return;
    }

    await this.getDocuments(selectedGood);
  }

  async getDocuments(trackedGood: ITrackedGood) {
    let config = {
      initialState: {
        trackedGood: trackedGood,
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    const count = await this.countAct(trackedGood.goodNumber);
    console.log({ count });
    if (count > 0) {
      this.modalService.show(GTrackerDocumentsComponent, config);
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

  otDocuments() {}

  async takeOneProcess(turnSelects: any) {
    await this.alertInfo(
      'info',
      'Más de un trámite seleccionado',
      'Se tomará el último registro seleccionado'
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
        '¿Desea visualizar las fotos de todos los bienes?',
        ''
      ).then(answ => {
        if (answ.isConfirmed) {
          this.router.navigate(['pages/general-processes/good-photos'], {
            queryParams: {
              photo: 'S',
              origin: 'FCONGENRASTREADOR',
            },
          });
        } else {
          const good = this.goods.filter(good => good.select == true);
          if (good.length) {
            if (good[0].goodNumber) {
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
              'Debe seleccionar un bien',
              ''
            );
          }
        }
      });
    } else {
      const good = this.goods.filter(good => good.select == true);
      if (good.length) {
        if (good[0].goodNumber) {
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
          'Debe seleccionar un bien',
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
      this.router.navigate(['/pages/administrative-processes/location-goods']);
      return;
    }

    if (this.origin == GOOD_TRACKER_ORIGINS.DestructionManagement) {
      this.router.navigate([
        '/pages/executive-processes/destruction-authorization-management',
      ]);
      return;
    }
    this.location.back();
  }

  include() {
    if (this.selectedGooods.length == 0) {
      this.onLoadToast('info', 'Info', 'Debe seleccionar almenos un bien');
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
      this.alert('warning', 'De doble click sobre la foto', '');
    } else {
      await this.getTem();

      this.goods.map(async good => {
        if (good.select) {
          lst_good = lst_good + `${good.goodNumber},`;
          this.insertListPhoto(Number(good.goodNumber));
          if (lst_good.length > 3600) {
            lst_good = lst_good.substring(0, lst_good.length - 1);
            this.insertListPhoto(Number(good.goodNumber));
            lst_good = '';
          }
        }
      });

      if (lst_good.length > 0) {
        lst_good = lst_good.substring(0, lst_good.length - 1);
        this.insertListPhoto(Number(lst_good));
        this.callReport(null, this.ngGlobal);
      } else {
        if (this.goods.length > 0) {
          this.insertListPhoto(Number(this.goods[0].goodNumber));
          this.callReport(Number(this.goods[0].goodNumber), null);
        } else {
          this.alert('error', 'Error', 'Se requiere de almenos un bien');
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

  insertListPhoto(goodNumber: number) {}

  async callReport(lnu_good: number, lnu_identificador: number) {
    if (!lnu_identificador) {
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
        .fetchReport('RCEDINFCONNUMERARIO', {
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
    const good = this.goods.filter(g => g.select == true)[0];

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
        'No tiene actas, programaciones, suspensiones ni cancelaciones'
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
    const goods = this.goods.filter(good => good.select == true);

    if (goods.length > 0) {
      if (goods.length > 1) {
        this.alertQuestion(
          'warning',
          '',
          'Se tiene varios bienes seleccionados se tomara el último',
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
      this.alert('error', 'Error', 'Se requiere un bien');
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

  getDataExcell() {
    this.excelLoading = true;
    this.goodTrackerService.getExcel(this.filters).subscribe({
      next: resp => {
        const mediaType =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
        const link = document.createElement('a');
        link.href = mediaType + resp.base64File;
        link.download = 'Rastreador_Bienes.xlsx';
        link.click();
        link.remove();
        this.excelLoading = false;
        this.alert('success', 'Archivo descargado correctamente', '');
      },
      error: () => {
        this.excelLoading = false;
        this.alert('error', 'Error', 'No se genero correctamente el archivo');
      },
    });
  }
}
