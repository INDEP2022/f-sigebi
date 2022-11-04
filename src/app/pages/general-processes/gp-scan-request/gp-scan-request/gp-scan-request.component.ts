import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-gp-scan-request',
  templateUrl: './gp-scan-request.component.html',
  styles: [],
})
export class GpScanRequestComponent implements OnInit {
  form = this.fb.group({
    noExpediente: [null, [Validators.required]],
    noVolante: [null, [Validators.required]],
    fecReception: [null, [Validators.required]],
    averPrevia: [null, [Validators.required]],
    causaPenal: [null, [Validators.required]],
    tocaPenal: [null, [Validators.required]],
    acta: [null, [Validators.required]],
    amparo: [null, [Validators.required]],
    tipoDoc: [null, [Validators.required]],
    naturaleza: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
    descripcion: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
