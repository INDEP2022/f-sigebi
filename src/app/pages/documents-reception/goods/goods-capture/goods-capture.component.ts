import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { TmpExpedientService } from 'src/app/core/services/ms-expedient/tmp-expedient.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { HOME_DEFAULT } from 'src/app/utils/constants/main-routes';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { SearchFractionComponent } from './components/search-fraction/search-fraction.component';
import { GoodsCaptureMain } from './goods-capture-main';
import {
  CASH_CODES,
  COMPENSATION_GOOD_CLASIF_NUMBER,
  FLYERS_REGISTRATION_CODE,
} from './utils/good-capture-constants';
import { getDeparturesIdsFromFraction } from './utils/goods-capture-functions';
import {
  EXPEDIENT_IS_SAT,
  TRANSFER_NULL_RECIVED,
} from './utils/goods-capture-messages';

@Component({
  selector: 'app-goods-capture',
  templateUrl: './goods-capture.component.html',
  styles: [],
})
export class GoodsCaptureComponent
  extends GoodsCaptureMain
  implements OnInit, AfterViewInit
{
  numerary: string | number = null;
  @ViewChild('initPage', { static: true }) initPage: ElementRef<HTMLDivElement>;
  initalStatus: string = null;
  constructor(
    fb: FormBuilder,
    modalService: BsModalService,
    goodsCaptureService: GoodsCaptureService,
    activatedRoute: ActivatedRoute,
    router: Router,
    menageService: MenageService,
    drDataService: DocumentsReceptionDataService,
    globalVarService: GlobalVarsService,
    private tmpExpedientService: TmpExpedientService,
    private _expedienService: ExpedientService,
    private comerDetailsService: ComerDetailsService,
    private accountMovementService: AccountMovementService,
    private statusXScreenService: StatusXScreenService
  ) {
    super(
      fb,
      modalService,
      goodsCaptureService,
      activatedRoute,
      router,
      menageService,
      drDataService,
      globalVarService
    );
  }
  ngAfterViewInit(): void {
    this.initPage.nativeElement.scroll(0, 0);
  }

  ngOnInit(): void {
    const identifica = this.params.iden ?? 'ASEG';
    this.setIdentifier(identifica);
    this.formControls.identifica.setValue(identifica);
    this.getInitalParameter().subscribe({
      next: () => this.initialParameterFound(),
    });
  }

  initialParameterFound() {
    if (this.isCalledFrom(FLYERS_REGISTRATION_CODE)) {
      this.whenIsCalledFromFlyers();
      this.fillGoodFromParameters();
    } else {
      this.selectExpedient();
    }

    this.fillSatSubject();
  }

  whenIsCalledFromFlyers() {
    if (this.global.noTransferente == null) {
      this.showError(TRANSFER_NULL_RECIVED);
      this.router.navigate(['/pages/general-processes/work-mailbox']);
      return;
    }

    if (this.global.gNoExpediente != null) {
      // ? No hace nada
      // this.getExpedientById(this.global.gNoExpediente as number).subscribe();
      // .add({
      //  this.validateExpedient()
      // });
    }
  }

  /**
   * validateExpedient() {
    this.goodsCaptureService
      .getGoodsByRecordId(Number(this.global.gNoExpediente))
      .subscribe({
        next: response => {
          console.log(response);
          this.vExp = response.count;
        },
      });
  }
   *
   */

  // ? ---------- La pantalla es llamanda desde el menú

  selectExpedient() {
    const modalConfig: ModalOptions = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (
          expedient: IRecord,
          isCompany: boolean,
          goodCompany?: number
        ) => {
          console.log({ expedient, isCompany, goodCompany });
          this.afterSelectExpedient(expedient, isCompany, goodCompany);
        },
      },
    };
    this.showSelectRecord(modalConfig);
  }

  afterSelectExpedient(
    expedient: IRecord,
    isCompany: boolean,
    companyGood?: number
  ) {
    this.companyGood = companyGood ?? null;
    const companyCtrl = this.assetsForm.controls.esEmpresa;
    const expedientNum = this.assetsForm.controls.noExpediente;
    this.global.gNoExpediente = expedient.id;
    // obtener el temp exp
    companyCtrl.setValue(isCompany);
    expedientNum.setValue(Number(expedient.id));
    this.focusInput('noClasifBien');
    this.validateSatExpedient(expedient.id).subscribe();
    this.getMaxPaperWork(expedient).subscribe({
      next: max => {
        console.log(max);
        this.validateMaxPaperwork(max);
      },
    });
    if (this.global.gnuActivaGestion == '1') {
      this.getMaxFlyerFromNotifications(expedient);
    }
    this.setIdenParam(expedient.identifier);
  }

  getMaxFlyerFromNotifications(record: IRecord) {
    this.goodsCaptureService.getMaxFlyerFromRecord(record.id).subscribe({
      next: value => {
        this.formControls.flyerNumber.setValue(value.no_volante);
      },
    });
  }

  async validateMaxPaperwork(max: number) {
    if (max == 2) {
      const response = await this.isCompensationGoodDialog();
      if (!response.isConfirmed) {
        this.showError(EXPEDIENT_IS_SAT);
        return;
      }
      this.getCompensationGood();
    }
  }

  areTypesRequired() {
    if (this.assetsForm.controls.esEmpresa.value) {
      this.typesRequired(true);
      this.focusInput('cantidad');
    } else {
      this.global.gNoExpediente = this.assetsForm.controls.noExpediente.value;
      this.typesRequired(false);
      this.focusInput('noClasifBien');
    }
  }

  getCompensationGood() {
    this.getGoodTypesByClasifNum(COMPENSATION_GOOD_CLASIF_NUMBER).subscribe({
      next: () => {
        this.disableElementsWhenGoodCompensation();
        this.focusInput('cantidad');
      },
    });
  }

  goodSssubtypeChange(sssubtype: IGoodSssubtype) {
    if (!this.formControls.sssubtype.value) {
      return;
    }
    if (!this.formControls.noClasifBien.value) {
      this.formControls.noClasifBien.setValue(sssubtype.numClasifGoods);
      this.goodClasifNumberChange();
      return;
    }
    this.formControls.noClasifBien.setValue(sssubtype.numClasifGoods);
    this.goodClasifNumberChange();
  }

  goodClasifNumberChange() {
    const clasifNum = this.formControls.noClasifBien.value;
    this.formControls.unidadMedida.reset();
    this.formControls.destino.reset();
    if (!clasifNum) {
      return;
    }
    if (CASH_CODES.find(_clasifNum => _clasifNum === clasifNum)) {
      this.formControls.cantidad.setValue(1);
    }
    if (this.formControls.satIndicator.value == 0) {
      this.getFractionsByClasifNum(clasifNum).subscribe({
        next: (response: any) => {
          this.fillFractions(response);
          this.patchSatTransferValue();
          this.getNoms();
          this.getUnitsByClasifNum(clasifNum).subscribe();
          this.getLabelsByClasifNum(clasifNum).subscribe();
        },
      });
    }
    if (this.formControls.satIndicator.value == 1) {
      this.getFractionsByClasifNum(clasifNum).subscribe({
        next: (response: any) => {
          this.fillFractions(response);
          this.patchSatTransferValue();
          this.getNoms();
          this.getUnitsByClasifNum(clasifNum).subscribe();
          this.getLabelsByClasifNum(clasifNum).subscribe();
        },
      });
    }
    if (this.formControls.satIndicator.value == null) {
      const clasifNum = this.formControls.noClasifBien.value;
      this.getGoodTypesByClasifNum(clasifNum)
        .pipe(switchMap(() => this.getGoodFeaturesByClasif(clasifNum)))
        .subscribe({
          next: () => {
            this.getUnitsByClasifNum(clasifNum).subscribe();
            this.getLabelsByClasifNum(clasifNum).subscribe();
          },
        });
    }
  }

  save() {
    const goodClasifNum = this.formControls.noClasifBien.value;

    let conciliate = true;
    this.assetsForm.markAllAsTouched();
    this.assetsForm.updateValueAndValidity();
    if (!this.assetsForm.valid) {
      this.showError('El formulario no es válido!');
      return;
    }

    if (CASH_CODES.find(clasifNum => clasifNum === goodClasifNum)) {
      conciliate = false;
      const body: any = {
        goodNumber: null,
        expedientNumber: null,
        coinKey: this.goodForm.controls.val1.value,
        bankKey: this.goodForm.controls.val4.value,
        accountKey: this.goodForm.controls.val6.value,
        deposit: this.goodForm.controls.val2.value,
        movementDate: this.goodForm.controls.val5.value,
        update: 'N',
      };

      this.comerDetailsService.faCoinciliationGood(body).subscribe({
        next: async (res: any) => {
          console.log(res);
          const response = res.data[0].fa_concilia_bien;
          this.numerary = response;
          if (response != 'N') {
            conciliate = true;
          }
          if (!conciliate) {
            const alert = await this.alertQuestion(
              'info',
              'Aviso',
              'No existe ningún depósito para conciliar el numerario capturado,¿Desea capturarlo de todas maneras? '
            );

            if (alert.isConfirmed) {
              this.copyFeatures();
              const goodId = this.formControls.noBien.value;
              if (!goodId) {
                this.createGood();
              } else {
                this.updateGood(goodId);
              }
            }
          } else {
            this.copyFeatures();
            const goodId = this.formControls.noBien.value;
            if (!goodId) {
              this.createGood();
            } else {
              this.updateGood(goodId);
            }
          }
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al buscar los movimientos de cuentas'
          );
        },
      });
    } else {
      this.copyFeatures();
      const goodId = this.formControls.noBien.value;
      if (!goodId) {
        this.createGood();
      } else {
        this.updateGood(goodId);
      }
    }
  }

  identChange() {
    const params = new FilterParams();
    params.addFilter('screenKey', 'FACTOFPCAPTURABIE');
    params.addFilter('identifier', this.formControls.identifica.value);
    params.addFilter('statusFinal', SearchFilter.NULL, SearchFilter.NOT);
    this.statusXScreenService.getList(params.getParams()).subscribe(res => {
      this.formControls.status.setValue(res.data[0].statusFinal.status ?? null);
    });
  }

  getAccountMovement() {
    const params = new FilterParams();
    params.addFilter('numberMotion', this.numerary);
    return this.accountMovementService.getAllFiltered(params.getParams());
  }

  handleSuccesSave(good: any) {
    // this.alert('success', 'Se agrego el bien al expediente', '');
    if (Number(this.numerary) > 0) {
      this.getAccountMovement()
        .pipe(
          switchMap(response => {
            console.log(response);
            const body = {
              numberGood: good.id,
              numberProceedings: good.fileNumber,
              numberMotion: this.numerary,
              numberAccount: response.data[0].numberAccount,
            };
            return this.accountMovementService.update(body).pipe(
              catchError(error => {
                this.numerary = null;
                return throwError(() => error);
              }),
              tap(() => {
                this.numerary = null;
              })
            );
          })
        )
        .subscribe();
    }
    if (this.formControls.esEmpresa.value) {
      this.createMenage(good);
    } else {
      this.askMoreGoods();
    }
  }

  async askMoreGoods() {
    console.log({ tipoTramite: this.paperworkType });
    if (
      this.params.origin === FLYERS_REGISTRATION_CODE &&
      (this.paperworkType == 2 || this.paperworkType == 3)
    ) {
      this.onLoadToast(
        'success',
        'Se agregó el bien al expediente correctamente',
        ''
      );
      const _global = { ...this.globalNgrx, gCommit: 'S', gOFFCommit: 'N' };
      this.globalVarService.updateGlobalVars(_global);
      this.router.navigate(['/pages/documents-reception/flyers-registration']);
      return;
    }
    const response = await this.alertQuestion(
      'success',
      'Se agregó el bien al expediente',
      '¿Desea agregar mas bienes?'
    );
    if (response.isConfirmed) {
      const fields = [
        'noPartida',
        'valorAvaluo',
        'capitulo',
        'partida',
        'subpartida',
        'ssubpartida',
        'noClasifBien',
        'type',
        'subtype',
        'ssubtype',
        'sssubtype',
        'unidadLigie',
        'unidadMedida',
        'cantidad',
        'destino',
        'estadoConservacion',
        'noBien',
        'valRef',
        'descripcion',
        'almacen',
        'entFed',
        'municipio',
        'ciudad',
        'localidad',
        'flyerNumber',
        'observaciones',
      ];
      this.setFieldsNull(fields);
      fields.forEach(field => {
        this.assetsForm.get(field).setErrors(null);
      });
      this.goodFeatures = [];
      window.scrollTo(0, 0);
    } else {
      if (this.params.origin === FLYERS_REGISTRATION_CODE) {
        const _global = { ...this.globalNgrx, gCommit: 'S', gOFFCommit: 'N' };
        this.globalVarService.updateGlobalVars(_global);
        this.router.navigate([
          '/pages/documents-reception/flyers-registration',
        ]);
      } else {
        this.router.navigate([HOME_DEFAULT]);
      }
    }
  }

  createMenage(good: any) {
    const menage = {
      noGood: this.companyGood,
      noGoodMenaje: good.id,
      roRegister: 1,
    };
    this.menageService.create(menage).subscribe({
      next: res => this.askMoreGoods(),
      error: error => {
        this.showError('Error al crear el menaje del bien');
      },
    });
  }

  createGood() {
    this.loading = true;

    if (this.params.origin == FLYERS_REGISTRATION_CODE) {
      this.createFromParams();
    } else {
      this.saveGood();
    }
  }

  createFromParams() {
    const expedient = Number(this.global.gNoExpediente);
    this.hideError();
    this.goodsCaptureService.findExpedient(expedient).subscribe({
      next: () => {
        this.saveGood();
      },
      error: error => {
        this.createWithTmpExp();
      },
    });
  }

  createWithTmpExp() {
    this.tmpExpedientService.getById(this.goodToSave.fileNumber).subscribe({
      next: expedient => {
        this.paperworkType = expedient.procedureType;
        this._expedienService.create(expedient as any).subscribe({
          next: expedient => {
            this.goodToSave.fileNumber = `${expedient.id}`;
            this.updateNotifications(expedient).subscribe({
              next: () => {
                this.saveGood();
              },
              error: error => {
                this.saveGood();
              },
            });
          },
          error: error => {
            // this.onLoadToast(
            //   'error',
            //   'Error',
            //   'Ocurrio un error al guardar el expediente'
            // );
          },
        });
      },
      error: error => {
        if (error.status > 0 && error.status >= 404) {
          this.saveGood();
        }
      },
    });
  }

  updateNotifications(expedient: any) {
    const params = new FilterParams();
    params.addFilter('expedientNumber', expedient.id);
    this.hideError();
    return this.goodsCaptureService
      .getTmpNotifications(params.getParams())
      .pipe(
        catchError(error => of({ data: [null] })),
        switchMap(tmpNotification =>
          this.createNotification(tmpNotification.data[0])
        )
      );
  }

  createNotification(tmpNotification: any) {
    this.hideError();
    if (!tmpNotification) {
      return of({});
    }
    const {
      affair,
      delegation,
      departament,
      institutionNumber,
      subDelegation,
      minpubNumber,
    } = tmpNotification;
    console.log({
      affair,
      delegation,
      departament,
      institutionNumber,
      subDelegation,
      minpubNumber,
    });
    const _notification = {
      ...tmpNotification,
      affair: affair?.id ?? null,
      delegation: delegation?.id ?? null,
      departament: departament?.id ?? null,
      institutionNumber: institutionNumber?.id ?? null,
      subDelegation: subDelegation?.id ?? null,
      minpubNumber: minpubNumber?.id ?? null,
    };
    return this.goodsCaptureService.createNotification(_notification).pipe(
      tap(notification => {
        this.goodToSave.flyerNumber = notification.wheelNumber;
      })
    );
  }

  saveGood() {
    this.goodsCaptureService.createGood(this.goodToSave).subscribe({
      next: good => {
        this.handleSuccesSave(good);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.showError('Ocurrio un error al guardar la información del bien');
      },
    });
  }

  updateGood(goodId: string | number) {
    this.loading = true;
    console.log(this.goodToSave);
    this.goodsCaptureService.updateGood(goodId, this.goodToSave).subscribe({
      next: response => {
        this.onLoadToast(
          'success',
          '',
          'Datos del bien guardados correctamente'
        );
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.showError('Ocurrio un error al guardar la información del bien');
      },
    });
  }

  copyFeatures() {
    this.goodToSave.goodClassNumber = this.formControls.noClasifBien.value + '';
    this.goodToSave.description = this.formControls.descripcion.value;
    this.goodToSave.quantity = this.formControls.cantidad.value + '';
    this.goodToSave.observations = this.formControls.observaciones.value;
    this.goodToSave.identifier = this.formControls.identifica.value + '';
    this.goodToSave.labelNumber = this.formControls.destino.value + '';
    this.goodToSave.unit = this.formControls.unidadMedida.value + '';
    this.goodToSave.referenceValue = this.formControls.valRef.value;
    this.goodToSave.satDepartureNumber = this.formControls.noPartida.value;
    this.goodToSave.status = this.formControls.status.value;
    this.goodToSave.vaultNumber;
    this.goodToSave.stateConservation =
      this.formControls.estadoConservacion.value;
    const goodFeaturesValue = this.goodForm.value;
    this.goodToSave.fileNumber = this.global.gNoExpediente + '';
    this.goodToSave = { ...this.goodToSave, ...goodFeaturesValue };
  }

  fractionChange() {
    const fractionCtrl = this.formControls.noPartida;
    if (!fractionCtrl.valid || !fractionCtrl.value) {
      return;
    }
    const body = getDeparturesIdsFromFraction(fractionCtrl.value);
    if (this.formControls.satIndicator.value == 0) {
      this.getAndFillFractions(body).subscribe({
        next: (response: any) => this.fillFractions(response),
      });
    }
  }

  searchFraction() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    };
    modalConfig.initialState = {
      callback: (next: string) => {
        if (next) {
          const body = getDeparturesIdsFromFraction(next);

          this.getAndFillFractions(body).subscribe({
            next: response => {
              this.fillFractions(response);
              this.patchSatTransferValue();
              this.getNoms();
              this.formControls.noPartida.setValue(next);
            },
          });
        }
      },
    };
    this.modalService.show(SearchFractionComponent, modalConfig);
  }
}
