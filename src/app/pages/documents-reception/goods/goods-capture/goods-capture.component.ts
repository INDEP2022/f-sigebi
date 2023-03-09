import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { switchMap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { TmpExpedientService } from 'src/app/core/services/ms-expedient/tmp-expedient.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { SearchFractionComponent } from './components/search-fraction/search-fraction.component';
import { GoodsCaptureMain } from './goods-capture-main';
import {
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
export class GoodsCaptureComponent extends GoodsCaptureMain implements OnInit {
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
    private _expedienService: ExpedientService
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

    if (this.global.pIndicadorSat == 1 || this.global.pIndicadorSat == 0) {
      this.fillSatSubject();
    }
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

  goodClasifNumberChange() {
    const clasifNum = this.formControls.noClasifBien.value;
    if (!clasifNum) {
      return;
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
    console.log(this.assetsForm.controls.cantidad);
    this.assetsForm.markAllAsTouched();
    this.assetsForm.updateValueAndValidity();
    if (!this.assetsForm.valid) {
      this.showError('El formulario no es válido!');
      return;
    }
    this.copyFeatures();
    const goodId = this.formControls.noBien.value;
    if (!goodId) {
      this.createGood();
    } else {
      this.updateGood(goodId);
    }
  }

  handleSuccesSave(good: any) {
    // this.alert('success', 'Se agrego el bien al expediente', '');
    if (this.formControls.esEmpresa.value) {
      this.createMenage(good);
    } else {
      this.askMoreGoods();
    }
  }

  async askMoreGoods() {
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
        this.router.navigate([
          '/pages/documents-reception/flyers-registration',
        ]);
      } else {
        this.router.navigate(['/']);
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
    console.log(this.goodToSave.fileNumber);
    if (this.params.origin == FLYERS_REGISTRATION_CODE) {
      this.tmpExpedientService.getById(this.goodToSave.fileNumber).subscribe({
        next: (expedient: any) => {
          this._expedienService.create(expedient).subscribe({
            next: () => {
              this.saveGood();
            },
            error: error => {
              this.onLoadToast(
                'error',
                'Error',
                'Ocurrio un error al guardar el expediente'
              );
            },
          });
        },
        error: error => {
          if (error.status > 0 && error.status >= 404) {
            this.saveGood();
          }
        },
      });
    } else {
      this.saveGood();
    }
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
