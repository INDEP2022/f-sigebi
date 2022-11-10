import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, merge, takeUntil } from 'rxjs';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DrFDocumentsReceptionFlyerSelectComponent } from './components/dr-f-documents-reception-flyer-select/dr-f-documents-reception-flyer-select.component';
import { DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS } from './constants/documents-reception-register-default-values';
import {
  DocuentsReceptionRegisterFormChanges,
  DOCUMENTS_RECEPTION_REGISTER_FORM,
  DOC_RECEPT_REG_FIELDS_TO_LISTEN,
} from './interfaces/documets-reception-register-form';

@Component({
  selector: 'app-rd-f-documents-reception-register',
  templateUrl: './rd-f-documents-reception-register.component.html',
  styles: [],
})
export class RdFDocumentsReceptionRegisterComponent
  extends BasePage
  implements OnInit
{
  documentsReceptionForm = this.fb.group(DOCUMENTS_RECEPTION_REGISTER_FORM);
  valuesChange: DocuentsReceptionRegisterFormChanges = {
    identifier: (value: string) => this.identifierChange(value),
    type: (value: string) => this.transferTypeChange(value),
  };
  transfers = new DefaultSelect();
  identifiers = new DefaultSelect(
    DOCUMENTS_RECEPTION_REGISTER_DEFAULT_IDENFIFIERS,
    3
  );
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  get procedureStatus() {
    return this.formControls.status;
  }

  private get formControls() {
    return this.documentsReceptionForm.controls;
  }

  ngOnInit(): void {
    // ! descomentar esta linea para mostrar el modal al inicio
    // this.selectFlyer();
    this.onFormChanges();
  }

  onFormChanges() {
    const $obs = this.detectFormChanges();
    $obs.subscribe({
      next: ({ field, value }) => this.valuesChange[field](value),
    });
  }

  private detectFormChanges() {
    return merge(
      ...DOC_RECEPT_REG_FIELDS_TO_LISTEN.map(field =>
        this.documentsReceptionForm.get(field).valueChanges.pipe(
          map(value => ({ field, value })),
          takeUntil(this.$unSubscribe)
        )
      )
    );
  }

  identifierChange(identifier: string) {
    if (!identifier) return;
    if (identifier.includes('4') || identifier === 'MIXTO')
      this.formControls.reception.disable();
    else this.formControls.reception.enable();
  }

  transferTypeChange(type: string) {
    if (type === 'T' || type === 'AT') {
      this.formControls.identifier.setValue('TRANS');
    }
  }

  fillForm(value: string | number) {
    this.documentsReceptionForm.reset();
    this.documentsReceptionForm.get('flyer').setValue(value);
  }

  selectFlyer() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        // TODO: Deberia recibir todos los datos para que el formulario sea llenado
        callback: (next: string | number) => {
          if (next) this.fillForm(next); // TODO: LLenar el formulario
        },
      },
    };
    this.modalService.show(
      DrFDocumentsReceptionFlyerSelectComponent,
      modalConfig
    );
  }

  sendFlyer() {
    this.documentsReceptionForm.get('status').setValue('ENVIADO');
  }

  viewDocuments() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  chooseOther() {
    this.selectFlyer();
  }

  save() {}
}
