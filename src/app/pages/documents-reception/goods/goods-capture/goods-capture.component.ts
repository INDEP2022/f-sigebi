import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { switchMap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { GoodsCaptureService, IRecord } from '../service/goods-capture.service';
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
    router: Router
  ) {
    super(fb, modalService, goodsCaptureService, activatedRoute, router);
  }

  ngOnInit(): void {
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
    const companyCtrl = this.assetsForm.controls.esEmpresa;
    const expedientNum = this.assetsForm.controls.noExpediente;
    this.global.gNoExpediente = expedient.idExpedient;
    companyCtrl.setValue(isCompany);
    expedientNum.setValue(Number(expedient.idExpedient));
    this.focusInput('noClasifBien');
    this.getMaxPaperWork(expedient).subscribe({
      next: max => this.validateMaxPaperwork(max),
    });
    if (this.global.gnuActivaGestion == '1') {
      this.getMaxFlyerFromNotifications(expedient);
    }
    this.setIdenParam(expedient.identifies);
  }

  getMaxFlyerFromNotifications(record: IRecord) {
    this.goodsCaptureService
      .getMaxFlyerFromRecord(record.idExpedient)
      .subscribe({
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
    this.getUnitsByClasifNum(clasifNum).subscribe();
    if (!clasifNum) {
      return;
    }
    if (this.formControls.satIndicator.value == 0) {
    }
    if (this.formControls.satIndicator.value == 1) {
    }
    if (this.formControls.satIndicator.value == null) {
      const clasifNum = this.formControls.noClasifBien.value;
      this.getGoodTypesByClasifNum(clasifNum)
        .pipe(switchMap(() => this.getGoodFeaturesByClasif(clasifNum)))
        .subscribe();
    }
  }

  save() {
    this.assetsForm.markAllAsTouched();
  }

  fractionChange() {
    const fractionCtrl = this.formControls.noPartida;
    if (!fractionCtrl.valid || !fractionCtrl.value) {
      return;
    }
    const body = getDeparturesIdsFromFraction(fractionCtrl.value);
    // if (this.formControls.satIndicator.value == 0) {
    this.getFractions(body).subscribe({
      next: (response: any) => {
        this.fillFractions(response);
        this.getGoodTypesByClasifNum(response.clasifGoodNumber).subscribe();
        this.getLigieUinitDescription(response.ligieUnit).subscribe();
      },
    });
    // }
  }
}
