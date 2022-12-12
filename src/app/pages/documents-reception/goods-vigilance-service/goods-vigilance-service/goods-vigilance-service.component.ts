import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-goods-vigilance-service',
  templateUrl: './goods-vigilance-service.component.html',
  styles: [],
})
export class GoodsVigilanceServiceComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      descripcionBien: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      statusBien: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accion: [null, [Validators.required]],
      aplica: [null, [Validators.required]],
      captura: [null, [Validators.required]],
      usuarioSolicita: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      usuarioCaptura: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      usuarioAutoriza: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      justificacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
