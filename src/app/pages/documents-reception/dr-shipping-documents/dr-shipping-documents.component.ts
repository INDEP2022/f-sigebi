import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SHIPPING_DOCUMENTS_COLUMNS,
  SHIPPING_DOCUMENTS_EXAMPLE_DATA,
} from './shipping-documents-columns';

@Component({
  selector: 'app-dr-shipping-documents',
  templateUrl: './dr-shipping-documents.component.html',
  styles: [],
})
export class DrShippingDocumentsComponent extends BasePage implements OnInit {
  documentsForm: FormGroup;
  settings = { ...TABLE_SETTINGS, actions: false };
  select = new DefaultSelect();
  data = SHIPPING_DOCUMENTS_EXAMPLE_DATA;

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = SHIPPING_DOCUMENTS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.documentsForm = this.fb.group({
      noOficio: [null, [Validators.required]],
      cveOficio: [null, [Validators.required]],
      fecTurno: [null, [Validators.required]],
      prioridad: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      destino: [null, [Validators.required]],
      noDestino: [null, [Validators.required]],
      subDestino: [null, [Validators.required]],
      noSubdestino: [null, [Validators.required]],
      area: [null, [Validators.required]],
      noArea: [null, [Validators.required]],
      text: [null],
      remitente: [null, [Validators.required]],
      destinatario: [null, [Validators.required]],
      cpp: [null],
    });
  }

  save() {
    this.documentsForm.markAllAsTouched();
  }
}
