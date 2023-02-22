import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  GOOD_PHOTOS_OPTIOS,
  TARGET_IDENTIFIERS,
} from '../../constants/goods-tracker-form';

@Component({
  selector: 'data-filter',
  templateUrl: './data-filter.component.html',
  styles: [],
})
export class DataFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  photosOptions = GOOD_PHOTOS_OPTIOS;
  targetIdentifiers = TARGET_IDENTIFIERS;
  form = this.fb.group({
    noBien: new FormControl(null, [Validators.required]),
    listBienes: new FormControl(null, [Validators.required]),
    proceso: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    invSami: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    listInv: new FormControl(null, [Validators.required]),
    destino: new FormControl(null, [Validators.required]),
    estatus: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    bienes: new FormControl(null, [Validators.required]),
    menaje: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    avaluoFrom: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    avaluoTo: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    fechaFoto: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    invMueble: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    gabinete: new FormControl(null, [Validators.required]),
    atributos: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    invSiabi: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    identificador: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    invCisi: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
