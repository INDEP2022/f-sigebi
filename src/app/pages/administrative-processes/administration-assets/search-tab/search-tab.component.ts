import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styles: [],
})
export class SearchTabComponent extends BasePage implements OnInit {
  searchTabForm: ModelForm<any>;
  list: any[] = [];
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = {
      code: {
        title: 'No. Volante',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Fecha Recepcion',
        type: 'string',
        sort: false,
      },
      relationPropertyKey: {
        title: 'Fecha Captura',
        type: 'string',
        sort: false,
      },
      referralNoteType: {
        title: 'No. Indiciado',
        type: 'string',
        sort: false,
      },
      versionUser: {
        title: 'Indiciado',
        type: 'string',
        sort: false,
      },
      creationUser: {
        title: 'Causa Penal',
        type: 'string',
        sort: false,
      },
      creationDate: {
        title: 'Averiguacion Previa',
        type: 'string',
        sort: false,
      },
      editionUser: {
        title: 'Autoridad Emisora',
        type: 'string',
        sort: false,
      },
      modificationDate: {
        title: 'No. Expediente',
        type: 'string',
        sort: false,
      },
      idRegister: {
        title: 'No. Asunto ',
        type: 'string',
        sort: false,
      },
      idRegistro: {
        title: 'Descripcion del Asunto ',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.searchTabForm = this.fb.group({
      noClasifBien: [null, [Validators.required]],
      noTipo: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      noSubtipo: [null, [Validators.required]],
      subtipo: [null, [Validators.required]],
      noSsubtipo: [null, [Validators.required]],
      ssubtipo: [null, [Validators.required]],
      noSssubtipo: [null, [Validators.required]],
      sssubtipo: [null, [Validators.required]],
      estatus: [null, [Validators.required]],
      unidadMedida: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      noDestino: [null, [Validators.required]],
      situacion: [null, [Validators.required]],
      destino: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      valRef: [null, [Validators.required]],
      identifica: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
  }
}
