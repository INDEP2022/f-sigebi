import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'certificates-filter',
  templateUrl: './certificates-filter.component.html',
  styles: [],
})
export class CertificatesFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  form = this.fb.group({
    fechaFrom: [null, [Validators.required]],
    fechaTo: [null, [Validators.required]],
    acta: [null, [Validators.required]],
    estatus: [null, [Validators.required]],
    cambioFrom: [null, [Validators.required]],
    cambioTo: [null, [Validators.required]],
    noEvento: [null, [Validators.required]],
    enProceso: [null, [Validators.required]],
    proceso: [null, [Validators.required]],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
