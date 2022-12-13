import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'record-notification-filter',
  templateUrl: './record-notification-filter.component.html',
  styles: [],
})
export class RecordNotificationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  form = this.fb.group({
    expediente: [null, [Validators.required]],
    volante: [null, [Validators.required]],
    noJuzgado: [null, [Validators.required]],
    expTrans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    tipoVolante: [null, [Validators.required]],
    listadoExp: [null, [Validators.required]],
    fechaOficio: [null, [Validators.required]],
    amparo: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    indiciado: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    minPub: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    tocaPenal: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    oficExt: [null, [Validators.required]],
    averPrevia: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
    dictamen: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    causaPenal: [
      null,
      [Validators.required, Validators.pattern(STRING_PATTERN)],
    ],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
