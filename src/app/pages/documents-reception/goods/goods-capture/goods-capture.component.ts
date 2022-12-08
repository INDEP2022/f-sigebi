import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsCaptureRecordSelectComponent } from './components/goods-capture-record-select/goods-capture-record-select.component';

@Component({
  selector: 'app-goods-capture',
  templateUrl: './goods-capture.component.html',
  styles: [],
})
export class GoodsCaptureComponent extends BasePage implements OnInit {
  assetsForm: FormGroup;
  select = new DefaultSelect();
  modalRef: BsModalRef;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.selectRecord();
  }

  prepareForm() {
    this.assetsForm = this.fb.group({
      noClasifBien: [null, [Validators.required]],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      unidadMedida: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      noDestino: [null, [Validators.required]],
      destino: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      valRef: [null, [Validators.required]],
      identifica: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
  }

  selectRecord() {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    this.modalService.show(GoodsCaptureRecordSelectComponent, modalConfig);
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
