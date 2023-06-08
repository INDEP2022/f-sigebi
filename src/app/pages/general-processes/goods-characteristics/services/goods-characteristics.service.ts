import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IGood } from 'src/app/core/models/good/good.model';
import {
  DOUBLE_POSITIVE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Injectable({
  providedIn: 'root',
})
export class GoodsCharacteristicsService {
  good: IGood | any;
  form: FormGroup;
  disabledBienes = true;
  disabledDescripcion = false;
  permisions = false;
  di_numerario_conciliado = 'No conciliado';
  newGood: any;
  goodChange = new Subject<boolean>();
  constructor(private fb: FormBuilder) {}

  prepareForm() {
    this.form = this.fb.group({
      type: [null],
      subtype: [null],
      ssubtype: [null],
      sssubtype: [null],
      noBien: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      noClasif: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      descripcion: [null, [Validators.pattern(STRING_PATTERN)]],
      unidad: [null, [Validators.pattern(STRING_PATTERN)]],
      cantidad: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      delegation: [null],
      subdelegation: [null],
      valRef: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaAval: [null],
      valorAval: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      longitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      avaluo: ['0'],
    });
  }
}
