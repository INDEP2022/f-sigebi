import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styles: [],
})
export class ScanRequestComponent implements OnInit {
  form = this.fb.group({
    noExpediente: [null, [Validators.required]],
    noVolante: [null, [Validators.required]],
    fecReception: [null, [Validators.required]],
    averPrevia: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    causaPenal: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    tocaPenal: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    acta: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    amparo: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    tipoDoc: [null, [Validators.required]],
    naturaleza: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    descripcion: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
