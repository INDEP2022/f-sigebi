import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-characteristics',
  templateUrl: './goods-characteristics.component.html',
  styles: [],
})
export class GoodsCharacteristicsComponent implements OnInit {
  form = this.fb.group({
    type: [null, [Validators.required]],
    subtype: [null, [Validators.required]],
    ssubtype: [null, [Validators.required]],
    sssubtype: [null, [Validators.required]],
    noBien: [null, [Validators.required]],
    noClasif: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    descripcion: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    unidad: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    cantidad: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    delegation: [null, [Validators.required]],
    subdelegation: [null, [Validators.required]],
    valRef: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    fechaAval: [null, [Validators.required]],
    valorAval: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    observaciones: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    latitud: [null, [Validators.required]],
    longitud: [null, [Validators.required]],
    avaluo: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
