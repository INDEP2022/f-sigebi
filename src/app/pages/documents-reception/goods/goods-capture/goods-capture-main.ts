import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
  params: Partial<IGoodCaptureParams> = {
    origin: null,
    // transferId: null,
    // recordId: null,
    // ? Entra a this.validateSat()
    // satSubject: '2012/157',
    // pOfficeNumber: '800-51-00-02-01-2012-2184',
    // ? Entra a this.fillData()
    satSubject: 'PD7500140022',
    pOfficeNumber: '800-45-00-02-01-2014-3783',
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
  modalRef: BsModalRef;
  vCount: number;
  vPartida: number;
  vExp: number;
  assetsForm = this.fb.group(GOOD_CAPTURE_FORM);
  goodForm = this.fb.group(GOOD_FORM);
  type: number;
  satCveUnique: number;
  good: any;
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
          },
        });
      this.formControls.noBien.setValue(this.global.gRastBien);
      this.formControls.cantidad.setValue(1);
    }
  }

  fillGoodForm() {
    this.assetsForm.patchValue({
      descripcion: this.good.description,
      cantidad: this.good.quantity,
      valRef: this.good.appraisedValue,
    });
  }

  // getGoodById() {
  //   this.goodsCaptureService.findGoodById(this.global.gRastBien).subscribe({
  //     next: good => {
  //       // TODO: Hacer match de los valores
  //       this.formControls.captura.setValue('E');
  //       this.formControls.requery.setValue('N');
  //     },
  //   });
  // }

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
}

interface IGoodTypesIds {
  typeId: number;
  subtypeId: number;
  ssubtypeId: number;
  sssubtypeId: number;
}
