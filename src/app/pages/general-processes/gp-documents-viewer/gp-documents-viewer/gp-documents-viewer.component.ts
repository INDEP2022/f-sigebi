import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS,
  GENERAL_DOCS_DOCUMENTS_VIEWER_DATA,
} from './documents-viewer-columns';

@Component({
  selector: 'app-gp-documents-viewer',
  templateUrl: './gp-documents-viewer.component.html',
  styleUrls: ['./gp-documents-viewer.component.scss'],
})
export class GpDocumentsViewerComponent extends BasePage implements OnInit {
  form = this.fb.group({
    expediente: [null, [Validators.required]],
    volante: [null, [Validators.required]],
    separador: [null, [Validators.required]],
    tipoDoc: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    descripcion: [null, [Validators.required]],
    averPrevia: [null, [Validators.required]],
    tipos: [null, [Validators.required]],
    causaPenal: [null, [Validators.required]],
    origen: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  data = GENERAL_DOCS_DOCUMENTS_VIEWER_DATA;
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS;
    this.settings.rowClassFunction = (row: { data: { status: boolean } }) =>
      row.data.status ? 'pending' : 'digital';
  }

  ngOnInit(): void {}
}
