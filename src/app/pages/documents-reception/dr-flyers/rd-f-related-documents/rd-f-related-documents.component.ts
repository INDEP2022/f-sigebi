import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  RELATED_DOCUMENTS_COLUMNS,
  RELATED_DOCUMENTS_EXAMPLE_DATA,
} from './related-documents-columns';

@Component({
  selector: 'app-rd-f-related-documents',
  templateUrl: './rd-f-related-documents.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
    `,
  ],
})
export class RdFRelatedDocumentsComponent extends BasePage implements OnInit {
  managementForm: FormGroup;
  settings = { ...TABLE_SETTINGS, actions: false };
  select = new DefaultSelect();
  data = RELATED_DOCUMENTS_EXAMPLE_DATA;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = RELATED_DOCUMENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.managementForm = this.fb.group({
      noVolante: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      tipoOficio: [null],
      relacionado: [null],
      numero: [null],
      noRemitente: [null],
      remitente: [null],
      noDestinatario: [null],
      destinatario: [null],
      noCiudad: [null],
      ciudad: [null],
      claveOficio: [null],
      parrafoInicial: [null],
      subtipo: [null],
      indPDoctos: [null],
      noBienes: [null],
      bienes: [null],
      noBienes2: [null],
      bienes2: [null],
      noDocumento: [null],
      documento: [null],
      noDocumento2: [null],
      documento2: [null],
      parrafoFinal: [null],
      parrafoAusencia: [null],
      ccp: [null],
      ccp2: [null],
      ccp3: [null],
      ccp4: [null],
      ccp5: [null],
      ccp6: [null],
    });
  }
}
