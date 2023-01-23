import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { ITypesByClasification } from 'src/app/core/models/catalogs/types-by-clasification';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { GoodsCaptureRecordSelectComponent } from './components/goods-capture-record-select/goods-capture-record-select.component';
import { IGlobalGoodsCapture } from './interfaces/good-capture-global';
import { IGoodCaptureParams } from './interfaces/goods-capture-params';
import { CASH_CODES, CVE_PARAMETER } from './utils/good-capture-constants';
import { GOOD_CAPTURE_FORM, GOOD_FORM } from './utils/good-capture-form';

import {
  COMPENSATION_GOOD_ALERT,
  NO_CLASIF_NUMBER_NOT_FOUND,
  NO_PARAMETER_FOUND,
  ONLY_CAN_CAPTURE_INMOVABLE_GOODS,
  ONLY_CAN_CAPTURE_MOVABLE_GOODS,
} from './utils/goods-capture-messages';

@Component({
  template: ``,
})
export class GoodsCaptureMain extends BasePage {
  @ViewChild('form') form: ElementRef;
  satTransfer: any = {};
  params: Partial<IGoodCaptureParams> = {
    origin: null,
    // transferId: null,
    // recordId: null,
    // ? Entra a this.validateSat()
    satSubject: '2012/157',
    pOfficeNumber: '800-51-00-02-01-2012-2184',
    // ? Entra a this.fillData()
    // satSubject: 'PD7500140022',
    // pOfficeNumber: '800-45-00-02-01-2014-3783',
    iden: '',
  };
  counter: number = 0;
  goodFeatures: any[] = [];
  global: IGlobalGoodsCapture = {
    gNoExpediente: 497938,
    gRastBien: 1,
    gRastBienExpedienteRel: null,
    gRastBienRel: null,
    gRastDescripcionBien: null,
    gRastTipo: 5,
    gRastSubtipo: 17,
    gRastSsubtipo: 1,
    gRastSssubtipo: 1,
    gCreaExpediente: null,
    gClasifNumber: null,
    vPgrOficio: null,
    gCommit: 'N',
    gFlag: 0,
    val1: null,
    val2: null,
    val3: null,
    val4: null,
    contador: 0,
    gnuActivaGestion: null,
    pIndicadorSat: 1,
    noTransferente: 583,
  };
  txtNoClasifBien: string = null;
  SAT_RECORD: number;
  ligieButtonEnabled: boolean = true;
  normsButtonEnabled: boolean = true;
  regulationsButtonEnabled: boolean = true;
  types = new DefaultSelect<IGoodType>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();
  select = new DefaultSelect();
  chapters = new DefaultSelect();
  departures = new DefaultSelect();
  sdepartures = new DefaultSelect();
  ssdepartures = new DefaultSelect();
  modalRef: BsModalRef;
  vCount: number;
  vPartida: number;
  vExp: number;
  assetsForm = this.fb.group(GOOD_CAPTURE_FORM);
  goodForm = this.fb.group(GOOD_FORM);
  type: number;
  satCveUnique: number;
  good: any;
  unitsMeasures = new DefaultSelect();
  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    public goodsCaptureService: GoodsCaptureService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    super();
    const paramsMap = this.activatedRoute.snapshot.queryParamMap;
    this.params.origin = paramsMap.get('origin');
  }

  get formControls() {
    return this.assetsForm.controls;
  }

  protected showError(message: string) {
    this.onLoadToast('error', 'Error', message);
  }

  isCalledFrom(origin: string): boolean {
    return this.params.origin == origin;
  }

  setIdenParam(identifier: string) {
    if (!identifier) {
      return;
    }

    const firstTwo = identifier.slice(0, 2);
    const first = identifier.slice(0, 1);
    const five = identifier.slice(0, 5);
    if (firstTwo == '4T') {
      this.params.iden = '4TON';
    } else if (firstTwo == '4M') {
      this.params.iden = '4MT';
    } else if (first == '6') {
      this.params.iden = '6TON';
    } else if (five == 'TRANS') {
      this.params.iden = 'TRANS';
    }
  }

  amountChange() {
    const amountControl = this.formControls.cantidad;
    const goodClasifNum = this.formControls.noClasifBien.value;
    if (CASH_CODES.find(clasifNum => clasifNum === goodClasifNum)) {
      amountControl.setValue(1);
    }
  }

  handleFillTypesError(
    httpError: HttpErrorResponse,
    message: string,
    fieldsToNull: string[]
  ) {
    if (httpError.status === 404) {
      this.showError('No existe el tipo de bien, consulte la lista');
    }
  }

  setFieldsNull(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.setValue(null);
    });
  }

  disableFields(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.disable();
    });
  }

  enableFields(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.disable();
    });
  }

  setRequiredFields(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.addValidators(Validators.required);
    });
  }

  unsetRequiredFields(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.removeValidators(Validators.required);
    });
  }

  hideObservations() {
    this.modalRef.hide();
  }

  showObservations(modal: TemplateRef<any>) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(modal, modalConfig);
  }

  /**
   * Muestra el modal para seleccionar el expediente
   * @param modalConfig Opciones del modal
   */
  showSelectRecord(modalConfig: ModalOptions) {
    this.modalService.show(GoodsCaptureRecordSelectComponent, modalConfig);
  }

  fillGoodFromParameters() {
    this.formControls.cambioValor.setValue('N');
    this.formControls.captura.setValue('C');
    if (this.global.gRastBien != null) {
      this.formControls.cambioValor.setValue('S');
      this.formControls.captura.setValue('E');
      const typesIds: IGoodTypesIds = {
        typeId: this.global.gRastTipo,
        subtypeId: this.global.gRastSubtipo,
        ssubtypeId: this.global.gRastSsubtipo,
        sssubtypeId: this.global.gRastSssubtipo,
      };
      this.getSssubtypeByIds(typesIds)
        .pipe(
          switchMap(sssubtype =>
            this.getGoodFeaturesByClasif(sssubtype.numClasifGoods)
          ),
          switchMap(() => this.getGoodById(this.global.gRastBien))
        )
        .subscribe({
          next: () => {
            this.fillGoodForm();
            // this.f
          },
        });
      this.formControls.noBien.setValue(this.global.gRastBien);
      this.formControls.cantidad.setValue(1);
    }
  }

  fillSatSubject() {
    const body: any = {
      officeKey: this.params.pOfficeNumber,
      missingAttribute: 1,
    };
    if (this.global.pIndicadorSat == 0) {
      body.asunto = this.params.satSubject;
    }
    this.formControls.satIndicator;
    let vCount = 0,
      vDeparture = 0;
    this.getSatTransfer(body)
      .pipe(
        tap((response: any) => {
          if (response.count < 1) {
            return;
          }
          const satTransfer = response.data[0];
          vCount = response.count;
          vDeparture = satTransfer.satDepartureNumber?.length ?? 0;
        })
      )
      .subscribe()
      .add(() => this.determinateWithTempExp(vCount, vDeparture));
  }

  determinateWithTempExp(vCount: number, vDeparture: number) {
    let type = 0;
    if (this.global.pIndicadorSat == 0 && vCount != 0) {
      this.formControls.satIndicator.setValue(1);
      this.disableFields(['noPartida']);
    } else if (this.global.pIndicadorSat == 1) {
      this.formControls.satIndicator.setValue(0);
    }
    this.getTempExp(this.global.gNoExpediente).subscribe({
      next: res => {
        type = res.type;
        this.global.vPgrOficio = res.officeNumber;
        if (type == 0) return;
        vDeparture >= 7 ? this.validateSat() : this.fillData();
      },
    });
  }

  // PUP_VALIDATE_SAT
  validateSat() {
    console.log('entro a validar sat');
    let satCveUnique: number = null;
    if (this.global.pIndicadorSat == 0) {
      // TODO: Implementar consultas
      this.validateSatCveUnique(satCveUnique);
    } else if (this.global.pIndicadorSat == 1) {
      // TODO: Implementar consultas
      this.validateSatCveUnique(satCveUnique);
    } else {
      this.validateSatCveUnique(satCveUnique);
    }
  }

  validateSatCveUnique(satCveUnique: number) {
    /** 
     *     IF :BIENES.CVE_UNICA_SAT IS NULL THEN
        :BIENES.CVE_UNICA_SAT := C_SAT_CVE_UNICA;
        :BIENES.INVENTARIO := C_SAT_CVE_UNICA;
    END IF;
    this.global.satCveUnique = satCveUnique
     */
    let long: number;
    if (!satCveUnique) {
      return;
    }
    if (this.global.pIndicadorSat == 0) {
      // TODO: volver a hacer consultas de vPartida
      // long = this.vPartida;
      this.validateLong(long);
    } else if (this.global.pIndicadorSat == 1) {
      // TODO: volver a hacer consultas de vPartida
      // long = this.vPartida
      this.validateLong(long);
    }
  }

  // PUP_LLENA_DATOS
  fillData() {
    console.log('Entra a llenar datos');
    // ? LA consulta que se va a implementar ya se ejecuta antes
    // ? se podria declarar un objeto global con la respuesta para no hacerla otra vez
    // of({vSubject, paperWorkType, vOfficeNumber})
    of({}).subscribe({
      next: () => {
        let vSubject;
        let paperWorkType;
        let vOfficeNumber;
        // get from temp exp
        if (paperWorkType == 3) {
          this.fillDataPgr();
          return;
        }

        let partida;
        // select from sat_transferencia
        if (partida && vSubject) {
          if (paperWorkType == 2) {
            // select tipos subtipos etc
            // select descripcion y observaciones
            // select unidad de medida
            this.params.iden = 'TRANS';
            return;
          }
          return;
        }
        if (paperWorkType == 2) {
          if (vSubject) {
            this.formControls.cantidad.setValue(1);
            let lClasif: number;
            let clasif;
            if (lClasif <= 4) {
              this.formControls.noClasifBien.setValue(clasif);
            } else {
              this.formControls.noClasifBien.setValue(null);
            }
            this.formControls.cantidad.setValue(1);
            this.params.iden = 'TRANS';
          } else {
            this.formControls.cantidad.setValue(1);
            let lClasif: number;
            let clasif;
          }
        }
      },
    });
  }

  validateLong(long: number) {
    if (long == 8) {
      if (this.global.pIndicadorSat == 0) {
        return;
      }

      if (this.global.pIndicadorSat == 1) {
        return;
      }
      return;
    }

    if (long == 7) {
      if (this.global.pIndicadorSat == 0) {
        return;
      }

      if (this.global.pIndicadorSat == 1) {
        return;
      }
      return;
    }

    if (long == 7 || long == 8) {
      // obtener partidas
      this.setLigieUnit();
      const goodClasifNum = this.formControls.noClasifBien.value;
      if (goodClasifNum != null) {
        if (goodClasifNum == 1427) {
          // marcar error
          return;
        }
        this.formControls.requery.setValue('S');
        // get tipos descripcion etc etc
        // ? Se puede pasar a type change
        const type = this.formControls.type.value;
        if (this.global.noTransferente == 121 && type != 5) {
          this.showError(
            'Para esta transferente solamente se pueden capturar muebles'
          );
          // throw error
        }
        if (this.global.noTransferente == 123 && type != 6) {
          this.showError(
            'Para esta transferente solamente se pueden capturar inmuebles'
          );
          // throw error
        }
        // fill types
        // IF goodclasifnum in 1424, 1426, 1590
        if (goodClasifNum == 1424) {
          this.formControls.cantidad.setValue(1);
        }

        // TODO: Hacer consultas para cada uno
        let nSAtTypeExpedient;
        let vSatRefIncumple;
        if (vSatRefIncumple == 0) {
          this.formControls.destino.setValue(1);
        } else {
          // foreach raro para obtener la etiqueta
          // y obtner la desc etiqueta
        }
        if (this.global.pIndicadorSat) {
          this.disableFields([]);
        } else {
          // this.enableFields([])
        }
      }
    }
  }

  setLigieUnit() {
    // FUP_SSF3_UNID_LIGIE
    // this.formControls.unidadLigie.setValue
  }

  // PUP_LLENA_DATOS_PGR
  fillDataPgr() {
    console.log('entro a llenar pgr');
  }

  fillGoodForm() {
    this.assetsForm.patchValue({
      descripcion: this.good.description,
      cantidad: this.good.quantity,
      valRef: this.good.appraisedValue,
    });
  }

  async isCompensationGoodDialog() {
    return await this.alertQuestion(
      'question',
      COMPENSATION_GOOD_ALERT,
      '',
      'Si'
    );
  }

  disableElementsWhenGoodCompensation() {
    const toDisable = [
      'noClasifBien',
      'type',
      'subtype',
      'ssubtype',
      'sssubtype',
      'estadoConservacion',
    ];
    this.disableFields(toDisable);
    this.ligieButtonEnabled = false;
    this.normsButtonEnabled = false;
    this.regulationsButtonEnabled = false;
  }

  isGoodTypeValid() {
    if (
      this.global.noTransferente == 121 &&
      this.formControls.type.value != '5'
    ) {
      this.showError(ONLY_CAN_CAPTURE_MOVABLE_GOODS);
      this.setFieldsNull(['type', 'subtype', 'ssubtype', 'sssubtype']);
      return false;
    }

    if (
      this.global.noTransferente == 123 &&
      this.formControls.type.value != '6'
    ) {
      this.showError(ONLY_CAN_CAPTURE_INMOVABLE_GOODS);
      this.setFieldsNull(['type', 'subtype', 'ssubtype', 'sssubtype']);
      return false;
    }
    if (!this.formControls.noClasifBien.value) {
      const fieldsToNull = ['subtype', 'ssubtype', 'sssubtype', 'noClasifBien'];
      this.setFieldsNull(fieldsToNull);
    }
    return true;
  }

  goodSsubtypeChange() {
    if (!this.formControls.noClasifBien.value) {
      const fieldsToNull = ['sssubtype', 'noClasifBien'];
      this.setFieldsNull(fieldsToNull);
    }
  }
  goodSssubtypeChange(sssubtype: IGoodSssubtype) {
    if (!this.formControls.noClasifBien.value) {
      this.formControls.noClasifBien.setValue(sssubtype.numClasifGoods);
      return;
    }
    this.formControls.noClasifBien.setValue(sssubtype.numClasifGoods);
    this.getGoodFeaturesByClasif(sssubtype.numClasifGoods).subscribe();
  }

  goodSubtypeChange() {
    if (!this.formControls.noClasifBien.value) {
      const fieldsToNull = ['ssubtype', 'sssubtype', 'noClasifBien'];
      this.setFieldsNull(fieldsToNull);
    }
  }

  fillGoodTypes(types: ITypesByClasification) {
    const { id, type, subtype, ssubtype, sssubtype } = types;
    this.types = new DefaultSelect([type], 1);
    this.subtypes = new DefaultSelect([subtype], 1);
    this.ssubtypes = new DefaultSelect([ssubtype], 1);
    this.sssubtypes = new DefaultSelect([sssubtype, 1]);
    this.formControls.noClasifBien.setValue(Number(id));
    this.formControls.type.setValue(`${type.id}`);
    this.formControls.subtype.setValue(`${subtype.id}`);
    this.formControls.ssubtype.setValue(`${ssubtype.id}`);
    this.formControls.sssubtype.setValue(`${sssubtype.id}`);
  }

  focusInput(controlName: string) {
    const selector = `[formcontrolname="${controlName}"]`;
    const input = this.form.nativeElement.querySelector(selector);
    input?.focus();
  }

  getInitalParameter() {
    return this.goodsCaptureService.getInitialParameter(CVE_PARAMETER).pipe(
      tap(parameter => (this.global.gClasifNumber = parameter.valorInicial)),
      catchError(error => {
        if (error.status === 404) this.showError(NO_PARAMETER_FOUND);
        this.router.navigate(['/home']);
        return error;
      })
    );
  }

  getSssubtypeByIds(goodTypeIds: IGoodTypesIds) {
    const { typeId, subtypeId, ssubtypeId, sssubtypeId } = goodTypeIds;
    return this.goodsCaptureService
      .getSssubtypeById(sssubtypeId, ssubtypeId, subtypeId, typeId)
      .pipe(
        tap(sssubtype => this.fillGoodTypesBySssubtype(sssubtype)),
        catchError(error => {
          if (error.status <= 404)
            this.showError('No existe el tipo de bien, consulte la lista');
          return throwError(() => error);
        })
      );
  }

  fillGoodTypesBySssubtype(sssubtype: IGoodSssubtype) {
    const { numType, numSubType, numSsubType } = sssubtype;
    this.types = new DefaultSelect([sssubtype.numType], 1);
    this.subtypes = new DefaultSelect([sssubtype.numSubType], 1);
    this.ssubtypes = new DefaultSelect([sssubtype.numSsubType], 1);
    this.sssubtypes = new DefaultSelect([sssubtype], 1);
    this.formControls.type.setValue((numType as IGoodType).id);
    this.formControls.subtype.setValue((numSubType as IGoodSubType).id);
    this.formControls.ssubtype.setValue((numSsubType as IGoodSsubType).id);
    this.formControls.sssubtype.setValue(sssubtype.id);
    this.formControls.noClasifBien.setValue(sssubtype.numClasifGoods);
  }

  getExpedientById(id: number) {
    return this.goodsCaptureService // TODO: checar cuando este el ms de expedientes
      .findExpedient(id)
      .pipe(
        tap(expedient => (this.global.noTransferente = expedient.transferId))
      );
  }

  getGoodFeaturesByClasif(clasifNum: number) {
    return this.goodsCaptureService.getGoodFeatures(clasifNum).pipe(
      tap(response => (this.goodFeatures = response.data)),
      catchError(error => {
        // TODO: Mostrar error cuando no se encuentran los atributos del bien
        return throwError(() => error);
      })
    );
  }

  getMeasureUnits(params: ListParams) {
    const clasifNum = this.formControls.noClasifBien.value;
    this.getUnitsByClasifNum(clasifNum, params).subscribe();
  }

  getGoodTypesByClasifNum(clasifNum: number) {
    return this.goodsCaptureService.getTypesByClasification(clasifNum).pipe(
      // share(),
      tap(goodTypes => this.fillGoodTypes(goodTypes)),
      catchError(error => {
        if (error.status <= 404) {
          this.showError(NO_CLASIF_NUMBER_NOT_FOUND);
        }
        return throwError(() => error);
      })
    );
  }

  getMaxPaperWork(expedient: IRecord) {
    return this.goodsCaptureService
      .getMaxFlyerFromRecord(expedient.idExpedient)
      .pipe(
        catchError(error => {
          if (error.status <= 404) {
            return of(1);
          }
          return of(2);
        })
      );
  }

  typesRequired(isRequired: boolean) {
    const requiredFields = [
      'type',
      'subtype',
      'ssubtype',
      'sssubtype',
      'descripcion',
      'cantidad',
    ];
    if (isRequired) {
      this.setRequiredFields(requiredFields);
    } else {
      this.unsetRequiredFields(requiredFields);
    }
  }

  getGoodById(id: number | string) {
    return this.goodsCaptureService
      .findGoodById(id)
      .pipe(tap((good: any) => (this.good = good.data)));
  }

  getUnitsByClasifNum(clasifNum: number, params?: ListParams) {
    return this.goodsCaptureService.getUnitsByClasifNum(clasifNum, params).pipe(
      tap((response: any) => {
        // console.log(response);
        this.unitsMeasures = new DefaultSelect(
          response.data,
          response.data.length
        );
      })
    );
  }

  getFractions(body: any) {
    return this.goodsCaptureService.getFractions(body);
    // .pipe();
  }

  getLigieUinitDescription(unit: string) {
    return this.goodsCaptureService.getLigieUnitDesc(unit).pipe(
      tap((response: any) => {
        this.formControls.unidadLigie.setValue(response.description);
      })
    );
  }

  fillFractions(fraction: any) {
    this.chapters = new DefaultSelect([fraction], 1);
    this.formControls.capitulo.setValue(fraction.chapter);
    this.departures = new DefaultSelect([fraction], 1);
    this.formControls.partida.setValue(fraction.departure);
    this.sdepartures = new DefaultSelect([fraction], 1);
    this.formControls.subpartida.setValue(fraction.sDeparture);
    this.ssdepartures = new DefaultSelect([fraction], 1);
    this.formControls.ssubpartida.setValue(fraction.ssDeparture);
  }

  getSatTransfer(body: any) {
    return this.goodsCaptureService.getSatTransfer(body).pipe(
      tap(response => {
        console.log(response);
      })
    );
  }

  // TODO: Implementar micorservicio cuando este listo
  getTempExp(officeKey: number | string) {
    return of({ type: 1, officeNumber: '123' });
  }
}

interface IGoodTypesIds {
  typeId: number;
  subtypeId: number;
  ssubtypeId: number;
  sssubtypeId: number;
}
