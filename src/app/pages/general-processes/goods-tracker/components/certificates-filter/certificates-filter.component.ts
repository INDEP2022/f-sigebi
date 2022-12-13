import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
    acta: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    estatus: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    cambioFrom: [null, [Validators.required]],
    cambioTo: [null, [Validators.required]],
    noEvento: [null, [Validators.required]],
    enProceso: [null, [Validators.required]],
    proceso: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
