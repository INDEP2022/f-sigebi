import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { ITypesByClasification } from 'src/app/core/models/catalogs/types-by-clasification';
import { ITempExpedient } from 'src/app/core/models/ms-expedient/tmp-expedient.model';
import { IPgrTransfer } from 'src/app/core/models/ms-interfacefgr/ms-interfacefgr.interface';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { GoodsCaptureRecordSelectComponent } from './components/goods-capture-record-select/goods-capture-record-select.component';
import { IGlobalGoodsCapture } from './interfaces/good-capture-global';
import { IGoodCaptureParams } from './interfaces/goods-capture-params';
import {
  CASH_CODES,
  CVE_PARAMETER,
  SAT_DISABLED_FIELDS,
  SIAVI_PARAMETER,
} from './utils/good-capture-constants';
import {
  GOOD_CAPTURE_FORM,
  GOOD_FORM,
  GOOD_TO_SAVE,
} from './utils/good-capture-form';
import { getDeparturesIdsFromFraction } from './utils/goods-capture-functions';

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
  paperworkType: number = 0;
  globalNgrx: any = {};
  goodToSave = new GOOD_TO_SAVE();
  satTransfer: any = {};
  params: Partial<IGoodCaptureParams> = {
    origin: null,
    // transferId: null,
    // recordId: null,
    // ? Entra a this.validateSat()
    satSubject: null,
    pOfficeNumber: null,
    // ? Entra a this.fillData()
    // satSubject: 'PD7500140022',
    // pOfficeNumber: '800-45-00-02-01-2014-3783',
    iden: null,
  };
  counter: number = 0;
  goodFeatures: any[] = [];
  global: IGlobalGoodsCapture = {
    gNoExpediente: null,
    gRastBien: null,
    gRastBienExpedienteRel: null,
    gRastBienRel: null,
    gRastDescripcionBien: null,
    gRastTipo: null,
    gRastSubtipo: null,
    gRastSsubtipo: null,
    gRastSssubtipo: null,
    gCreaExpediente: null,
    gClasifNumber: null,
    vPgrOficio: null,
    gCommit: null,
    gFlag: null,
    val1: null,
    val2: null,
    val3: null,
    val4: null,
    contador: null,
    gnuActivaGestion: null,
    pIndicadorSat: null,
    noTransferente: null,
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
  goodLabels = new DefaultSelect();
  modalRef: BsModalRef;
  vCount: number;
  vPartida: number;
  vExp: number;
  assetsForm = this.fb.group(new GOOD_CAPTURE_FORM());
  goodForm = this.fb.group(new GOOD_FORM());
  type: number;
  satCveUnique: string;
  good: any;
  unitsMeasures = new DefaultSelect();
  companyGood: number;
  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    public goodsCaptureService: GoodsCaptureService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public menageService: MenageService,
    public drDataService: DocumentsReceptionDataService,
    public globalVarService: GlobalVarsService
  ) {
    super();
    const paramsMap = this.activatedRoute.snapshot.queryParamMap;

    this.params.origin = paramsMap.get('origin');
    const frParams = this.drDataService.goodsCaptureTempParams;
    this.params.iden = frParams.iden;
    this.global.noTransferente = frParams.noTransferente;
    this.params.satSubject = frParams.asuntoSat;
    this.params.pOfficeNumber = frParams.pNoOficio;
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe), take(1))
      .subscribe({
        next: global => {
          this.globalNgrx = global;
          this.global.gNoExpediente = global.gNoExpediente;
          // this.global.gNoExpediente = 6172868;
          console.log(global);
          this.global.gnuActivaGestion = global.gnuActivaGestion;
          this.global.pIndicadorSat = global.pIndicadorSat;
          console.log(this.global);
          // this.global.pIndicadorSat = 1;
        },
      });
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
    if (
      amountControl.value != 1 &&
      CASH_CODES.find(clasifNum => clasifNum === goodClasifNum)
    ) {
      this.onLoadToast(
        'info',
        'Aviso',
        'Para este clasificador la cantidad permitida es 1'
      );
    }
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
          this.satTransfer = satTransfer;
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
    if (!this.global.gNoExpediente) {
      return;
    }
    this.getTempExp(this.global.gNoExpediente)
      .pipe(
        tap((response: any) => {
          console.log(response);
          type = response.procedureType;
          this.global.vPgrOficio = response.noOffice;
        })
      )
      .subscribe()
      .add(() => {
        if (type != 0) {
          vDeparture >= 7 ? this.validateSat() : this.fillData();
        }
      });
  }

  // PUP_VALIDATE_SAT
  validateSat() {
    const satCveUnique: string = this.satTransfer?.satOnlyKey ?? null;
    // TODO: Checar funcionamiento
    // this.good.CVE_UNICA_SAT= satCveUnique;
    // this.good.INVENTARIO= satCveUnique
    this.satCveUnique = satCveUnique;
    if (satCveUnique != null) {
      const departureLength = this.satTransfer.satDepartureNumber.length ?? 0;

      if (departureLength == 7 || departureLength == 8) {
        const body = getDeparturesIdsFromFraction(
          this.satTransfer.satDepartureNumber
        );
        this.getAndFillFractions(body).subscribe({
          next: response => {
            this.fillFractions(response);
            this.patchSatTransferValue();
            this.getNoms();
          },
        });
      }
    }
    this.disableSatFields();
  }

  disableSatFields() {
    if (this.global.pIndicadorSat == 0) {
      this.disableFields(SAT_DISABLED_FIELDS);
      this.ligieButtonEnabled = false;
    }
  }

  getNoms() {
    const onlyKey = this.satCveUnique;
    this.getTinmBreakCount({ onlyKey })
      .pipe(tap((response: any) => this.findGoodLabel(response?.data?.length)))
      .subscribe();
  }

  findGoodLabel(count: number) {
    this.getMinGoodLabel().subscribe();
    let labelNum = 0;
    if (count == 0) {
      labelNum = 1;
      this.getGoodLabel(labelNum).subscribe();
    } else {
    }
  }

  patchSatTransferValue() {
    this.formControls.descripcion.setValue(this.satTransfer?.satDescription);
    this.formControls.unidadMedida.setValue(this.satTransfer?.saeUnitMeasure);
    this.formControls.cantidad.setValue(this.satTransfer?.satAmount);
  }

  getAndFillFractions(body: any) {
    return this.getFractions(body).pipe(
      switchMap((response: any) =>
        forkJoin([
          this.getGoodTypesByClasifNum(response.clasifGoodNumber),
          this.getGoodFeaturesByClasif(response.clasifGoodNumber),
          this.getLigieUinitDescription(response.ligieUnit),
        ]).pipe(map(() => response))
      )
    );
  }

  // PUP_LLENA_DATOS
  fillData() {
    const expedientNum = Number(this.global.gNoExpediente);
    this.getTempExp(expedientNum).subscribe({
      next: (expedient: any) => this.fillWithTempExpedient(expedient),
    });
  }

  getDataPgr(tmpExpedient: ITempExpedient) {
    const params = new FilterParams();
    params.addFilter('pgrOffice', tmpExpedient.jobNumber);
    this.goodsCaptureService
      .getInterfaceFgr(params.getParams())
      .subscribe(response => {
        const pgr = response.data[0];
        this.fillFromPgr(pgr);
      });
  }

  fillFromPgr(pgr: IPgrTransfer) {
    let type, desc, quantity, unit, edo;
    const {
      pgrTypeGoodVeh,
      pgrTypeGoodAer,
      pgrTypeGoodEmb,
      pgrTypeGoodNum,
      pgrTypeGoodInm,
      pgrTypeGoodJoy,
      pgrTypeGoodDiv,
      pgrTypeGoodMen,
    } = pgr;
    if (pgrTypeGoodVeh) {
      type = pgrTypeGoodVeh;
      desc = pgr.pgrDescrGoodVeh;
      quantity = pgr.pgrAmountVeh;
      unit = pgr.pgrUnitMeasureVeh;
      edo = pgr.pgrEdoPhysicalVeh;
    } else if (pgrTypeGoodAer) {
      type = pgrTypeGoodAer;
      desc = pgr.pgrDescrGoodAer;
      quantity = pgr.pgrAmountAer;
      unit = pgr.pgrUniMeasureAer;
      edo = pgr.pgrEdoPhysicalVeh;
    } else if (pgrTypeGoodEmb) {
      type = pgrTypeGoodEmb;
      desc = pgr.pgrDescrGoodEmb;
      quantity = pgr.pgrAmountEmb;
      unit = pgr.pgrUniMeasureEmb;
      edo = pgr.pgrEdoPhysicalEmb;
    } else if (pgrTypeGoodInm) {
      type = pgrTypeGoodInm;
      desc = pgr.pgrDescrGoodInm;
      quantity = pgr.pgrAmountInm;
      unit = pgr.pgrUniMeasureInm;
      edo = pgr.pgrEdoPhysicalInm;
    } else if (pgrTypeGoodNum) {
      type = pgrTypeGoodNum;
      desc = pgr.pgrDescrGoodNum;
      quantity = pgr.pgrAmountNum;
      unit = pgr.pgrUniMeasureNum;
      edo = pgr.pgrEdoPhysicalNum;
    } else if (pgrTypeGoodJoy) {
      type = pgrTypeGoodJoy;
      desc = pgr.pgrDescrGoodJoy;
      quantity = pgr.pgrAmountJoy;
      unit = pgr.pgrUniMeasureJoy;
      edo = pgr.pgrEdoPhysicalJoy;
    } else if (pgrTypeGoodDiv) {
      type = pgrTypeGoodDiv;
      desc = pgr.pgrDescrGoodDiv;
      quantity = pgr.pgrAmountDiv;
      unit = pgr.pgrUniMeasureDiv;
      edo = pgr.pgrEdoPhysicalDiv;
    } else if (pgrTypeGoodMen) {
      type = pgrTypeGoodMen;
      desc = pgr.pgrDescrGoodMen;
      quantity = pgr.pgrAmountMen;
      unit = pgr.pgrUniMeasureMen;
      edo = pgr.pgrEdoPhysicalMen;
    }
    console.log({ type, desc, quantity, unit, edo });
    this.assetsForm.controls.cantidad.setValue(quantity);
    this.assetsForm.controls.descripcion.setValue(desc);
    this.assetsForm.controls.noClasifBien.setValue(type);
    this.assetsForm.controls.destino.setValue('3');
    const _unit = unit?.trim() == 'PZ' ? 'PIEZA' : unit;
    this.assetsForm.controls.unidadMedida.setValue(_unit);
    this._fillAllForm();
  }

  _fillAllForm() {
    const clasifNum = this.formControls.noClasifBien.value;
    if (!clasifNum) {
      return;
    }
    if (this.formControls.satIndicator.value == 0) {
      this.getFractionsByClasifNum(clasifNum).subscribe({
        next: (response: any) => {
          this.fillFractions(response);
          this.patchSatTransferValue();
          // this.getNoms();
          this.getUnitsByClasifNum(clasifNum).subscribe();
          this.goodsCaptureService.getLabelById(3).subscribe(label => {
            const _label = {
              labelNumber: label.id,
              e_descripcion: label.description,
            };
            this.goodLabels = new DefaultSelect([_label], 1);
          });
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
          this.goodsCaptureService.getLabelById(3).subscribe(label => {
            const _label = {
              labelNumber: label.id,
              e_descripcion: label.description,
            };
            this.goodLabels = new DefaultSelect([_label], 1);
          });
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
            this.goodsCaptureService.getLabelById(3).subscribe(label => {
              const _label = {
                labelNumber: label.id,
                e_descripcion: label.description,
              };
              this.goodLabels = new DefaultSelect([_label], 1);
            });
          },
        });
    }
  }

  fillWithTempExpedient(tmpExpedient: ITempExpedient) {
    const { procedureType, jobNumber, affair } = tmpExpedient;
    this.paperworkType = procedureType;
    if (procedureType == 3) {
      this.getDataPgr(tmpExpedient);
    } else {
      const body = {
        officeKey: jobNumber,
        expType: affair,
      };
      this.getAllExpJob(body).subscribe({
        next: response => {
          const first = response?.data[0];
          if (!first) return;
          if (first.satDepartureNumber != null && affair != null) {
            if (procedureType == 2) {
              this.getGoodByDepartureNum(first.satDepartureNumber).subscribe();
              this.fillTempDescription(tmpExpedient);
            }
          } else if (procedureType == 2) {
            this.fillDataSatSubject(tmpExpedient);
          }
        },
      });
    }
  }

  fillDataSatSubject(tmpExpedient: ITempExpedient) {
    this.formControls.cantidad.setValue(1);
    const { procedureType, jobNumber, affair } = tmpExpedient;
    if (!affair) return;
    this.formControls.cantidad.setValue(1);
    const body = {
      jobNumber: jobNumber,
      affair: affair,
    };
    this.getTempGood(body).subscribe({
      next: (tempGood: any) => {
        const typesIds: IGoodTypesIds = {
          typeId: tempGood.goodType,
          subtypeId: tempGood.goodSubType,
          ssubtypeId: tempGood.goodSsubType,
          sssubtypeId: tempGood.goodSssubType,
        };
        this.getSssubtypeByIds(typesIds)
          .pipe(
            switchMap(sssubtype =>
              this.getGoodFeaturesByClasif(sssubtype.numClasifGoods)
            )
          )
          .subscribe();
      },
    });
  }

  fillTempDescription(tmpExpedient: any) {
    const { typeTranssact, noOffice, subject } = tmpExpedient;
    const body = {
      jobNumber: noOffice,
      affair: subject,
    };
    this.getTempGood(body).subscribe({
      next: (tempGood: any) => {
        this.formControls.descripcion.setValue(tempGood.description);
        this.formControls.observaciones.setValue(tempGood.observations);
      },
    });
    const _body = {
      officeKey: noOffice,
      asunto: subject,
    };
    this.getSatTransfer(_body).subscribe({
      next: response => {
        const first = response.data[0];
        if (!first) return;
        this.formControls.unidadMedida.setValue(first.saeUnitMeasure);
        this.setIdentifier('TRANS');
      },
    });
  }

  setIdentifier(identifier: string) {
    this.params.iden = identifier;
    this.formControls.identifica.setValue(this.params.iden);
  }

  getGoodByDepartureNum(departureNum: string | number) {
    return this.goodsCaptureService.getDataGoodByDeparture(departureNum).pipe(
      tap((response: any) => {
        const typesIds: IGoodTypesIds = {
          typeId: response.typeNumber,
          subtypeId: response.subtypeNumber,
          ssubtypeId: response.ssubtypeNumber,
          sssubtypeId: response.sssubtypeNumber,
        };
        this.getSssubtypeByIds(typesIds)
          .pipe(
            switchMap(sssubtype =>
              this.getGoodFeaturesByClasif(sssubtype.numClasifGoods)
            )
          )
          .subscribe();
      })
    );
  }

  fillGoodForm() {
    this.assetsForm.patchValue({
      descripcion: this.good.description,
      cantidad: this.good.quantity,
      valRef: this.good.appraisedValue,
      unidadMedida: this.good.unit,
      destino: this.good.labelNumber,
      identifica: this.good.identifier,
      observaciones: this.good.observations,
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
    return this.goodsCaptureService.getParamterById(CVE_PARAMETER).pipe(
      tap(parameter => (this.global.gClasifNumber = parameter.valorInicial)),
      catchError(error => {
        if (error.status === 404) this.showError(NO_PARAMETER_FOUND);
        this.router.navigate(['/']);
        return error;
      })
    );
  }

  getSiaviLink() {
    this.goodsCaptureService
      .getParamterById(SIAVI_PARAMETER)
      .pipe(
        tap((parameter: any) => {
          const departure = this.formControls.noPartida.value;
          const link =
            parameter.initialValue + departure + parameter.finalValue;
          window.open(link, '_blank');
        }),
        catchError(error => {
          if (error.status === 404)
            this.showError('No se encontró la ruta de la URL de las NOMS.');
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  getSssubtypeByIds(goodTypeIds: IGoodTypesIds) {
    const { typeId, subtypeId, ssubtypeId, sssubtypeId } = goodTypeIds;
    return this.goodsCaptureService
      .getSssubtypeById(sssubtypeId, ssubtypeId, subtypeId, typeId)
      .pipe(
        tap(sssubtype => this.fillGoodTypesBySssubtype(sssubtype)),
        switchMap(sssubtype =>
          this.getUnitsByClasifNum(sssubtype.numClasifGoods).pipe(
            map(() => sssubtype)
          )
        ),
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
    return this.goodsCaptureService.findExpedient(id);
  }

  getGoodFeaturesByClasif(clasifNum: number) {
    console.log('llego');
    return this.goodsCaptureService.getGoodFeatures(clasifNum).pipe(
      tap(response => {
        this.goodFeatures = response.data.sort(
          (feat: any, _feat: any) => feat.columnNumber - _feat.columnNumber
        );
      }),
      catchError(error => {
        this.showError(
          'No existen atributos para el clasificador Seleccionado'
        );
        return throwError(() => error);
      })
    );
  }

  getMeasureUnits(params: ListParams) {
    const clasifNum = this.formControls.noClasifBien.value;
    if (!clasifNum) {
      return;
    }
    this.getUnitsByClasifNum(clasifNum, params).subscribe();
    this.getLabelsByClasifNum(clasifNum).subscribe();
  }

  getGoodTypesByClasifNum(clasifNum: number) {
    return this.goodsCaptureService.getTypesByClasification(clasifNum).pipe(
      tap(goodTypes => {
        this.fillGoodTypes(goodTypes);
        this.getUnitsByClasifNum(clasifNum).subscribe();
        this.getLabelsByClasifNum(clasifNum).subscribe();
        this.getGoodFeaturesByClasif(clasifNum).subscribe();
      }),
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
      .getMaxPaperWorkByExpedient(expedient.id)
      .pipe(
        catchError(error => {
          if (error.status <= 404) {
            return of(1);
          }
          return of(2);
        }),
        map((response: any) => Number(response.max) ?? 0)
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
      catchError(error => {
        if (error.status <= 404) {
          this.showError('No hay unidades de medida para este clasificador');
        }
        return throwError(() => error);
      }),
      tap((response: any) => {
        this.unitsMeasures = new DefaultSelect(
          response.data,
          response.data?.length
        );
      })
    );
  }

  getLabelsByClasifNum(clasifNum: string | number) {
    return this.goodsCaptureService.getLabelsByClasif(clasifNum).pipe(
      tap(response => {
        this.goodLabels = new DefaultSelect(response.data, response.count);
      })
    );
  }

  getFractions(body: any) {
    return this.goodsCaptureService.getFractions(body).pipe(
      catchError(error => {
        if (error.status <= 500) {
          this.showError('Fracción arancelaria inexistente, rectifique.');
        }
        return throwError(() => error);
      })
    );
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
    if (!this.formControls.noPartida.value) {
      this.formControls.noPartida.setValue(fraction.fraction);
    }
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
    return this.goodsCaptureService.getSatTransfer(body);
  }

  getTempExp(officeKey: number | string) {
    const expedientId = this.global.gNoExpediente;
    return this.goodsCaptureService.getTempExpedientById(expedientId);
  }

  getTempGood(body: any) {
    return this.goodsCaptureService.getTempGood(body).pipe(
      catchError(error => {
        this.showError('No existen las caracteristicas de este bien');
        return throwError(() => error);
      })
    );
  }

  getTinmBreakCount(body: any) {
    return this.goodsCaptureService.getSatTinmBreak(body).pipe(
      catchError(error => {
        this.showError('Sucedio un error al buscar las NOMs incumplidas');
        return throwError(() => error);
      })
    );
  }

  getGoodLabel(labelNum: number) {
    return this.goodsCaptureService.getGoodLabelById(labelNum).pipe(
      tap(goodLabel => {
        // this.goodLabels = new DefaultSelect([goodLabel], 1);
        this.formControls.destino.setValue(goodLabel.id);
      })
    );
  }

  getFractionsByClasifNum(clasifNum: number) {
    return this.goodsCaptureService.getFractionByClasifNum(clasifNum).pipe(
      catchError(error => {
        this.showError('No existe el clasificador');
        return throwError(() => error);
      }),
      switchMap((response: any) => {
        return this.getAndFillFractions(response);
      })
    );
  }

  getMinGoodLabel() {
    const satUniqueKey = this.formControls.noPartida.value;
    return this.goodsCaptureService.getNoms(satUniqueKey).pipe(
      tap((response: any) => {
        let min = 0;
        if (response?.data?.length > 0) {
          response?.data.forEarch((nom: any) => {
            if (min < Number(nom.labelNumber)) {
              min = nom.labelNumber;
            }
          });
          this.formControls.identifica.setValue(min);
        }
      })
    );
  }

  getAllExpJob(body: any) {
    return this.goodsCaptureService.getAllExpJob(body);
  }

  validateSatExpedient(fileNumber: string) {
    return this.goodsCaptureService.getSatTransExp({ fileNumber }).pipe(
      tap(async response => {
        if (response.count > 0) {
          await this.alertQuestion(
            'error',
            'El expediente es de procedencia del SAT, no se pueden capturar mas bienes',
            ''
          );
        }
      })
    );
  }
}

interface IGoodTypesIds {
  typeId: number;
  subtypeId: number;
  ssubtypeId: number;
  sssubtypeId: number;
}
function combinateLatest(): import('rxjs').OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}
