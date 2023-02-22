import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GoodsCaptureService,
  ICompensationGood,
  IRecord,
} from '../service/goods-capture.service';
import { GoodsCaptureRecordSelectComponent } from './components/goods-capture-record-select/goods-capture-record-select.component';
import { GOOD_CAPTURE_FORM } from './utils/good-capture-form';
interface IGlobalVariables {
  satIndicator: number;
}
@Component({
  selector: 'app-goods-capture',
  templateUrl: './goods-capture.component.html',
  styles: [],
})
export class GoodsCaptureComponent extends BasePage implements OnInit {
  global: IGlobalVariables = {
    satIndicator: null,
  };
  SAT_RECORD: number;
  ligieButtonEnabled: boolean = true;
  normsButtonEnabled: boolean = true;
  regulationsButtonEnabled: boolean = true;
  types = new DefaultSelect<IGoodType>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();
  assetsForm = this.fb.group(GOOD_CAPTURE_FORM);
  select = new DefaultSelect();
  modalRef: BsModalRef;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsCaptureService: GoodsCaptureService
  ) {
    super();
  }

  get formControls() {
    return this.assetsForm.controls;
  }

  ngOnInit(): void {
    this.selectRecord();
  }

  selectRecord() {
    const modalConfig: ModalOptions = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        callback: (record: IRecord) => {
          this.getMaxPaperwork(record);
        },
      },
    };
    this.modalService.show(GoodsCaptureRecordSelectComponent, modalConfig);
  }

  handleMaxPaperworkError(error: HttpErrorResponse) {
    this.SAT_RECORD = error.status == 404 ? 1 : 2;
  }

  getMaxPaperwork(record?: IRecord) {
    of(2).subscribe({
      next: max => (this.SAT_RECORD = max),
      error: error => this.handleMaxPaperworkError(error),
      complete: () => this.validateSatRecord(),
    });
  }

  validateSatRecord() {
    if ((this.SAT_RECORD = 2)) {
      this.onLoadToast(
        'warning',
        'Alerta',
        'El nuevo bien es de Resarcimiento'
      );
      this.getCompensationGood();
    }
  }

  getCompensationGood() {
    this.goodsCaptureService.getGoodCompensation().subscribe({
      next: response => this.fillGoodCompensation(response.data[0]),
    });
  }

  goodClasifNumberChange() {
    if (this.formControls.satIndicator.value == 0) {
    }
    if (this.formControls.satIndicator.value == null) {
      this.getGoodTypesByClasificationNumber();
    }
  }

  getGoodTypesByClasificationNumber() {
    const clasificationNumber = this.formControls.noClasifBien.value;
    this.goodsCaptureService
      .getGoodTypesByClasificationNumber(clasificationNumber)
      .subscribe({
        next: goodTypes => this.fillGoodCompensation(goodTypes.data[0]),
        error: error => console.log(error),
      });
  }

  /**
   *
   * @param compensationGood Bien de resarcimiento
   */
  fillGoodCompensation(compensationGood: ICompensationGood) {
    const {
      id,
      noType,
      descType,
      noSubtype,
      descSubtype,
      noSsubtype,
      descSsubtype,
      noSssubtype,
      descSssubtype,
    } = compensationGood;

    this.types = new DefaultSelect([{ id: noType, nameGoodType: descType }], 1);
    this.subtypes = new DefaultSelect(
      [{ id: noSubtype, nameSubtypeGood: descSubtype }],
      1
    );
    this.ssubtypes = new DefaultSelect(
      [{ id: noSsubtype, description: descSsubtype }],
      1
    );
    this.sssubtypes = new DefaultSelect([
      { id: noSssubtype, description: descSssubtype },
      1,
    ]);
    this.formControls.noClasifBien.setValue(id);
    this.formControls.type.setValue(noType);
    this.formControls.subtype.setValue(noSubtype);
    this.formControls.ssubtype.setValue(noSsubtype);
    this.formControls.sssubtype.setValue(noSssubtype);
    this.formControls.noClasifBien.disable();
    this.formControls.type.disable();
    this.formControls.subtype.disable();
    this.formControls.ssubtype.disable();
    this.formControls.sssubtype.disable();
    this.ligieButtonEnabled = false;
    this.normsButtonEnabled = false;
    this.regulationsButtonEnabled = false;
    this.formControls.estadoConservacion.disable();
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
}
