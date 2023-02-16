import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from '../../../shared/components/select/default-select';

@Component({
  selector: 'app-complement-article',
  templateUrl: './complement-article.component.html',
  styles: [],
})
export class ComplementArticleComponent implements OnInit {
  form: FormGroup;
  itemsSelect = new DefaultSelect();
  constructor(private fb: FormBuilder, private service: ExpedientService) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      fechaFe: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      clasificacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      remarks: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      solicitud: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      moneda: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fechaVigencia: [null, [Validators.required]],
      fechaAvaluo: [null, [Validators.required]],
      perito: [null, [Validators.required]],
      institucion: [null, [Validators.required]],
      fechaDictamen: [null, [Validators.required]],
      dictamenPerito: [null, [Validators.required]],
      dictamenInstitucion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dictamenPerenidad: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fechaAseg: [null, [Validators.required]],
      notificado: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      lugar: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  getExpedient() {
    console.log('blur');
    this.service.getById(this.form.get('expediente').value).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }
}
