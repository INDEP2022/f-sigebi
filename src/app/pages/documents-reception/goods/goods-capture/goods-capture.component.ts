import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { ITypesByClasification } from 'src/app/core/models/catalogs/types-by-clasification';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
import { GoodsCaptureRecordSelectComponent } from './components/goods-capture-record-select/goods-capture-record-select.component';
import { GoodsCaptureMain } from './goods-capture-main';
import { IGoodTypeChangeActions } from './interfaces/good-type-change-actions';
import {
  CASH_CODES,
  COMPENSATION_GOOD_CLASIF_NUMBER,
  CVE_PARAMETER,
  FLYERS_REGISTRATION_CODE,
  SSSUBTYPE_NOT_FOUND_FIELDS,
  SSUBTYPE_NOT_FOUND_FIELDS,
  SUBTYPE_NOT_FOUND_FIELDS,
  TYPE_NOT_FOUND_FIELDS,
} from './utils/good-capture-constants';
import {
  COMPENSATION_GOOD_ALERT,
  EXPEDIENT_IS_SAT,
  GOOD_TYPE_NOT_FOUND,
  NO_CLASIF_NUMBER_NOT_FOUND,
  NO_PARAMETER_FOUND,
  ONLY_CAN_CAPTURE_INMOVABLE_GOODS,
  ONLY_CAN_CAPTURE_MOVABLE_GOODS,
  TRANSFER_NULL_RECIVED,
} from './utils/goods-capture-messages';

@Component({
  selector: 'app-goods-capture',
  templateUrl: './goods-capture.component.html',
  styles: [],
})
export class GoodsCaptureComponent extends GoodsCaptureMain implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsCaptureService: GoodsCaptureService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(fb);
    const paramsMap = this.activatedRoute.snapshot.queryParamMap;
    this.params.origin = paramsMap.get('origin');
    this.params.transferId = Number(paramsMap.get('transferId'));
    this.params.recordId = Number(paramsMap.get('recordId'));
  }

  get formControls() {
    return this.assetsForm.controls;
  }

  ngOnInit(): void {
    this.goodsCaptureService.getInitialParameter(CVE_PARAMETER).subscribe({
      next: goodParameter => {
        this.global.gClasifNumber = goodParameter.valorInicial;
        this.initialParameterFound();
      },
      error: error => {
        if (error.status === 404) {
          this.showError(NO_PARAMETER_FOUND);
        }
      },
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

  fillSatSubject() {
    const body = {
      officeKey: this.params.pOfficeNumber,
      expedient: this.params.satSubject,
    };
    if (this.global.pIndicadorSat == 0) {
      this.goodsCaptureService.getSatInterfaceCountByExpedient(body).subscribe({
        next: response => (this.vCount = response.count),
        error: () => (this.vCount = 0),
      });
    } else if (this.global.pIndicadorSat == 1) {
    } else if (!this.global.pIndicadorSat) {
    }
  }

  whenIsCalledFromFlyers() {
    if (!this.params.transferId) {
      this.showError(TRANSFER_NULL_RECIVED);
      this.router.navigate(['/pages/general-processes/work-mailbox']);
      return;
    }

    if (this.params.recordId) {
      this.goodsCaptureService.findExpedient(this.params.recordId).subscribe({
        next: expedient => {
          this.params.transferId = expedient.transferId;
        },
        complete: () => this.validateRecordId(),
      });
    }
  }

  validateRecordId() {
    this.goodsCaptureService
      .getGoodsByRecordId(this.params.recordId)
      .subscribe({
        next: response => {
          // TODO: Checar la funcionalida de PUP_INICIALIZA FORMA linea 94
        },
        complete: () => {
          this.fillGoodFromParameters();
        },
      });
  }

  fillGoodFromParameters() {
    this.formControls.cambioValor.setValue('N');
    this.formControls.captura.setValue('C');
    if (this.global.gRastBien) {
      this.fillGoodType(this.global.gRastTipo, {
        validate: true,
        getNext: true,
      });
      this.formControls.noBien.setValue(this.global.gRastBien);
      this.formControls.cantidad.setValue(1);
      this.fillGoodFeatures();
    }
  }

  fillGoodFeatures() {
    this.getGoodById();
  }

  getGoodById() {
    this.goodsCaptureService.findGoodById(this.global.gRastBien).subscribe({
      next: good => {
        // TODO: Hacer match de los valores
        this.formControls.captura.setValue('E');
        this.formControls.requery.setValue('N');
      },
    });
  }

  fillGoodType(goodTypeId: number | string, actions?: IGoodTypeChangeActions) {
    const { validate, getNext } = actions;
    this.formControls.type.setValue(goodTypeId);
    if (validate && !this.isGoodTypeValid()) {
      this.setFieldsNull(['type', 'subtype', 'ssubtype', 'sssubtype']);
      return;
    }
    this.goodsCaptureService.getTypeById(goodTypeId).subscribe({
      next: goodType => {
        this.types = new DefaultSelect([goodType], 1);
        if (getNext)
          this.fillGoodSubtype(this.global.gRastSubtipo, {
            validate: true,
            getNext: true,
          });
      },
      error: error => {
        this.handleFillTypesError(
          error,
          GOOD_TYPE_NOT_FOUND('tipo'),
          TYPE_NOT_FOUND_FIELDS
        );
      },
    });
  }

  fillGoodSubtype(
    goodSubtype: number | string,
    actions?: IGoodTypeChangeActions
  ) {
    this.formControls.subtype.setValue(goodSubtype);
    const { validate, getNext } = actions;
    if (validate) this.goodSubtypeChange();
    this.goodsCaptureService.getSubtypeById(goodSubtype).subscribe({
      next: goodSubtype => {
        this.subtypes = new DefaultSelect([goodSubtype], 1);
        if (getNext) {
          this.fillGoodSsubtype(this.global.gRastSsubtipo, {
            validate: true,
            getNext: true,
          });
        }
      },
      error: error => {
        this.handleFillTypesError(
          error,
          GOOD_TYPE_NOT_FOUND('subtipo'),
          SUBTYPE_NOT_FOUND_FIELDS
        );
      },
    });
  }

  fillGoodSsubtype(
    goodSsubtype: number | string,
    actions?: IGoodTypeChangeActions
  ) {
    this.formControls.ssubtype.setValue(goodSsubtype);
    const { validate, getNext } = actions;
    if (validate) this.goodSsubtypeChange();
    this.goodsCaptureService.getSsubtypeById(goodSsubtype).subscribe({
      next: goodSsubtype => {
        this.ssubtypes = new DefaultSelect([goodSsubtype], 1);
        if (getNext) {
          this.fillGoodSssubtype(this.global.gRastSssubtipo, {
            validate: true,
          });
        }
      },
      error: error => {
        this.handleFillTypesError(
          error,
          GOOD_TYPE_NOT_FOUND('ssubtipo'),
          SSUBTYPE_NOT_FOUND_FIELDS
        );
      },
    });
  }

  fillGoodSssubtype(
    goodSssubtype: number | string,
    actions?: IGoodTypeChangeActions
  ) {
    this.formControls.sssubtype.setValue(goodSssubtype);
    const { validate } = actions;
    this.goodsCaptureService.getSssubtypeById(goodSssubtype).subscribe({
      next: goodSssubtype => {
        if (validate) this.goodSssubtypeChange(goodSssubtype);
        this.sssubtypes = new DefaultSelect([goodSssubtype], 1);
      },
      error: error => {
        this.handleFillTypesError(
          error,
          GOOD_TYPE_NOT_FOUND('sssubtipo'),
          SSSUBTYPE_NOT_FOUND_FIELDS
        );
      },
    });
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
    }
  }

  goodSubtypeChange() {
    if (!this.formControls.noClasifBien.value) {
      const fieldsToNull = ['ssubtype', 'sssubtype', 'noClasifBien'];
      this.setFieldsNull(fieldsToNull);
    }
  }

  isGoodTypeValid() {
    if (this.params.transferId == 121 && this.formControls.type.value != '5') {
      this.showError(ONLY_CAN_CAPTURE_MOVABLE_GOODS);
      this.setFieldsNull(['type', 'subtype', 'ssubtype', 'sssubtype']);
      return false;
    }

    if (this.params.transferId == 123 && this.formControls.type.value != '6') {
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

  // ? ---------- La pantalla es llamanda desde el menú

  selectExpedient() {
    const modalConfig: ModalOptions = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (record: IRecord) => {
          this.afterSelectExpedient(record);
        },
      },
    };
    this.modalService.show(GoodsCaptureRecordSelectComponent, modalConfig);
  }

  afterSelectExpedient(record: IRecord) {
    this.getMaxPaperwork(record);
    if (this.global.gnuActivaGestion == '1') {
      // ! Descomentar cuando el ms este listo
      this.getMaxFlyerFromNotifications(record);
    }
    this.setIdenParam(record.identifies);
  }

  getMaxFlyerFromNotifications(record: IRecord) {
    this.goodsCaptureService
      .getMaxFlyerFromRecord(record.idExpedient)
      .subscribe({
        next: value => {
          // TODO: Asignar el max value a ti_no_volante
          this.formControls.flyerNumber.setValue(value.no_volante);
          // this.showError(
          //   'El expediente Es de Procedencia del SAT no puede capturar mas Bienes'
          // );
        },
      });
  }

  getMaxPaperwork(record?: IRecord) {
    // TODO: Implementar microservicio de gestion de tramite
    of(1).subscribe({
      next: max => (this.SAT_RECORD = max),
      error: error => this.handleMaxPaperworkError(error),
      complete: () => this.validateSatRecord(),
    });
  }

  handleMaxPaperworkError(error: HttpErrorResponse) {
    this.SAT_RECORD = error.status == 404 ? 1 : 2;
  }

  async validateSatRecord() {
    if (this.SAT_RECORD == 2) {
      const response = await this.alertQuestion(
        'question',
        COMPENSATION_GOOD_ALERT,
        '',
        'Si'
      );
      if (response.isConfirmed) {
        this.getCompensationGood();
        this.disableElementsWhenGoodCompensation();
      } else {
        this.showError(EXPEDIENT_IS_SAT);
      }
    }
  }

  getCompensationGood() {
    this.goodsCaptureService
      .getTypesByClasification(COMPENSATION_GOOD_CLASIF_NUMBER)
      .subscribe({
        next: types => {
          this.fillGoodTypes(types);
        },
        error: error => console.log(error),
      });
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

  fillGoodTypes(types: ITypesByClasification) {
    const { id, type, subtype, ssubtype, sssubtype } = types;
    this.types = new DefaultSelect([type], 1);
    this.subtypes = new DefaultSelect([subtype], 1);
    this.ssubtypes = new DefaultSelect([ssubtype], 1);
    this.sssubtypes = new DefaultSelect([sssubtype, 1]);
    this.formControls.noClasifBien.setValue(Number(id));
    this.formControls.type.setValue(type.id);
    this.formControls.subtype.setValue(subtype.id);
    this.formControls.ssubtype.setValue(ssubtype.id);
    this.formControls.sssubtype.setValue(sssubtype.id);
  }

  goodClasifNumberChange() {
    const clasifNum = this.formControls.noClasifBien.value;
    if (!clasifNum) {
      return;
    }
    if (this.formControls.satIndicator.value == 0) {
    }
    if (this.formControls.satIndicator.value == 1) {
    }
    if (!this.formControls.satIndicator.value) {
      this.getGoodTypesByClasificationNumber();
    }
  }

  getGoodTypesByClasificationNumber() {
    const clasificationId = this.formControls.noClasifBien.value;
    this.goodsCaptureService
      .getTypesByClasification(clasificationId)
      .subscribe({
        next: goodTypes => this.fillGoodTypes(goodTypes),
        error: error => {
          if (error.status == 404) {
            this.showError(NO_CLASIF_NUMBER_NOT_FOUND);
          }
        },
      });
  }

  hideObservations() {
    this.modalRef.hide();
  }

  showObservations(modal: TemplateRef<any>) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(modal, modalConfig);
  }

  save() {
    this.assetsForm.markAllAsTouched();
  }

  private setFieldsNull(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.setValue(null);
    });
  }

  private disableFields(fields: string[]) {
    fields.forEach(field => {
      this.assetsForm.get(field)?.disable();
    });
  }

  handleFillTypesError(
    httpError: HttpErrorResponse,
    message: string,
    fieldsToNull: string[]
  ) {
    if (httpError.status === 404) {
      this.showError(message);
      this.setFieldsNull(fieldsToNull);
    }
  }

  amountChange() {
    const amountControl = this.formControls.cantidad;
    const goodClasifNum = this.formControls.noClasifBien.value;
    if (CASH_CODES.find(clasifNum => clasifNum === goodClasifNum)) {
      amountControl.setValue(1);
    }
  }

  getTargetIdentifiers() {}
}
