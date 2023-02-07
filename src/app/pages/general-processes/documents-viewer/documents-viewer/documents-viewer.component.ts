import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS,
  GENERAL_DOCS_DOCUMENTS_VIEWER_DATA,
} from './documents-viewer-columns';

@Component({
  selector: 'app-documents-viewer',
  templateUrl: './documents-viewer.component.html',
  styleUrls: ['./documents-viewer.component.scss'],
})
export class DocumentsViewerComponent extends BasePage implements OnInit {
  form = this.fb.group({
    expediente: [null, [Validators.required]],
    volante: [null, [Validators.required]],
    separador: [null, [Validators.required]],
    tipoDoc: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    descripcion: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    averPrevia: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    tipos: [null, [Validators.required]],
    causaPenal: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
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
