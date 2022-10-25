import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-gp-goods-characteristics',
  templateUrl: './gp-goods-characteristics.component.html',
  styles: [],
})
export class GpGoodsCharacteristicsComponent implements OnInit {
  form = this.fb.group({
    type: [null, [Validators.required]],
    subtype: [null, [Validators.required]],
    ssubtype: [null, [Validators.required]],
    sssubtype: [null, [Validators.required]],
    noBien: [null, [Validators.required]],
    noClasif: [null, [Validators.required]],
    status: [null, [Validators.required]],
    descripcion: [null, [Validators.required]],
    unidad: [null, [Validators.required]],
    cantidad: [null, [Validators.required]],
    delegation: [null, [Validators.required]],
    subdelegation: [null, [Validators.required]],
    valRef: [null, [Validators.required]],
    fechaAval: [null, [Validators.required]],
    valorAval: [null, [Validators.required]],
    observaciones: [null, [Validators.required]],
    latitud: [null, [Validators.required]],
    longitud: [null, [Validators.required]],
    avaluo: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
