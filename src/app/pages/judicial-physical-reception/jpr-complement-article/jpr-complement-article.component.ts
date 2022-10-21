import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from '../../../shared/components/select/default-select';

@Component({
  selector: 'app-jpr-complement-article',
  templateUrl: './jpr-complement-article.component.html',
  styles: [],
})
export class JprComplementArticleComponent implements OnInit {
  form: FormGroup;
  itemsSelect = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      fechaFe: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      clasificacion: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      solicitud: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      moneda: [null, [Validators.required]],
      fechaVigencia: [null, [Validators.required]],
      fechaAvaluo: [null, [Validators.required]],
      perito: [null, [Validators.required]],
      institucion: [null, [Validators.required]],
      fechaDictamen: [null, [Validators.required]],
      dictamenPerito: [null, [Validators.required]],
      dictamenInstitucion: [null, [Validators.required]],
      dictamenPerenidad: [null, [Validators.required]],
      fechaAseg: [null, [Validators.required]],
      notificado: [null, [Validators.required]],
      lugar: [null, [Validators.required]],
    });
  }
}
