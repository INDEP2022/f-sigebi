import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dr-goods-vigilance-service',
  templateUrl: './dr-goods-vigilance-service.component.html',
  styles: [],
})
export class DrGoodsVigilanceServiceComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      descripcionBien: [null, [Validators.required]],
      statusBien: [null, [Validators.required]],
      accion: [null, [Validators.required]],
      aplica: [null, [Validators.required]],
      captura: [null, [Validators.required]],
      usuarioSolicita: [null, [Validators.required]],
      usuarioCaptura: [null, [Validators.required]],
      usuarioAutoriza: [null, [Validators.required]],
      justificacion: [null, [Validators.required]],
    });
  }
}
