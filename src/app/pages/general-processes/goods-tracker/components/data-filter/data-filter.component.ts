import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
    proceso: new FormControl(null, [Validators.required]),
    invSami: new FormControl(null, [Validators.required]),
    listInv: new FormControl(null, [Validators.required]),
    destino: new FormControl(null, [Validators.required]),
    estatus: new FormControl(null, [Validators.required]),
    bienes: new FormControl(null, [Validators.required]),
    menaje: new FormControl(null, [Validators.required]),
    avaluoFrom: new FormControl(null, [Validators.required]),
    avaluoTo: new FormControl(null, [Validators.required]),
    fechaFoto: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required]),
    invMueble: new FormControl(null, [Validators.required]),
    gabinete: new FormControl(null, [Validators.required]),
    atributos: new FormControl(null, [Validators.required]),
    invSiabi: new FormControl(null, [Validators.required]),
    identificador: new FormControl(null, [Validators.required]),
    invCisi: new FormControl(null, [Validators.required]),
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
