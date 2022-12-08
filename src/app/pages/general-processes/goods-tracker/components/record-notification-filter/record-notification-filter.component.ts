import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
    expTrans: [null, [Validators.required]],
    tipoVolante: [null, [Validators.required]],
    listadoExp: [null, [Validators.required]],
    fechaOficio: [null, [Validators.required]],
    amparo: [null, [Validators.required]],
    indiciado: [null, [Validators.required]],
    minPub: [null, [Validators.required]],
    tocaPenal: [null, [Validators.required]],
    oficExt: [null, [Validators.required]],
    averPrevia: [null, [Validators.required]],
    dictamen: [null, [Validators.required]],
    causaPenal: [null, [Validators.required]],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
