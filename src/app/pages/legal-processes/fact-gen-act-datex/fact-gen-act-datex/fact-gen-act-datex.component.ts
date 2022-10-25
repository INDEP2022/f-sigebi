import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-gen-act-datex',
  templateUrl: './fact-gen-act-datex.component.html',
  styleUrls: ['./fact-gen-act-datex.component.scss'],
})
export class FactGenActDatexComponent {
  tableFactGenSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noVolante: {
        title: 'No Volante',
      },
      asunto: {
        title: 'Asunto',
      },
      descripcion: {
        title: 'Descripción',
      },
      fechaCaptura: {
        title: 'Fecha Captura',
      },
      claveAmparo: {
        title: 'Clave Amparo',
      },
      averiguacionPrevia: {
        title: 'Averiguación Previa',
      },
      causaPenal: {
        title: 'Causa Penal',
      },
      noExpediente: {
        title: 'No Expediente',
      },
    },
  };

  dataFactGen = [
    {
      noVolante: 1466449,
      asunto: '5',
      descripcion: 'DOCUMENTACION COMPLEMENTARIA',
      fechaCaptura: '18-10-2018 09:50',
      claveAmparo: '',
      averiguacionPrevia: 'FED/JAL/GDN',
      causaPenal: '',
      noExpediente: '1',
    },
  ];

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: ['', [Validators.required]],
    });
  }

  public get noExpediente() {
    return this.form.get('noExpediente');
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }
}
