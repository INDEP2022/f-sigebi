import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pe-gdadd-c-destruction-authorization-management',
  templateUrl: './pe-gdadd-c-destruction-authorization-management.component.html',
  styles: [
  ]
})
export class PeGdaddCDestructionAuthorizationManagementComponent extends BasePage implements OnInit  {
  
  settings = TABLE_SETTINGS;
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noAuth: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(1), Validators.pattern(NUMBERS_PATTERN)]],
      requesOffice: ['', [Validators.required]],
      requesScop: ['', [Validators.required]],
      recepDate: ['', [Validators.required]],
      scopDate: ['', [Validators.required]],
      inteDate: ['', [Validators.required]],
    });
  }

  tableActRecSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external',

    columns: {
      actasRecepcion: {
        title: 'Actas de Recepción',
      },
    },
  };

  dataActRec = [
    {
      actasRecepcion: "RT/AGA/ADM/DRBC/00254/17/12",
    },
    {
      actasRecepcion: "RT/AGA/ADM/DRBC/00232/17/12",
    },
    {
      actasRecepcion: "RT/AGA/ADM/TIJ/TIJ/02320/11/10",
    },

  ];

  tableDictamSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external', 

    columns: {
      actasRecepcion: {
        title: 'Dictaminaciones',
      },
    },
  };

  dataDictam = [
    {
      actasRecepcion: "DCCR/DECRO/DRBC/ATJRBC/00001/2018",
    },
    {
      actasRecepcion: "DCCR/DECRO/DRBC/ATJRBC/00002/2018",
    },
    {
      actasRecepcion: "DCCR/DECRO/DRBC/ATJRBC/00003/2018",
    },

  ];

  
  tableNoBienSettings = {

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
    columns: {
      noBien: {
        title: 'No. Bien',
        width: '25px'
      },
      descripcion: {
        title: 'Descripción',
      },
      cantidad: {
        title: 'Cantidad',
      },
      ofsol: {
        title: 'Of. Sol.'
      },
    },
  };

  dataNoBien = [
    {
      noBien: 85431,
      descripcion: "ROLLO DE PAPEL",
      cantidad: 1,
      ofsol: "DCCR/DECRO/DRBC/ATJRBC/00001/2018"
    },

    {
      noBien: 3051053,
      descripcion: "DISCOS EN FORMATO CD Y DVD",
      cantidad: 98,
      ofsol: "DCCR/DECRO/DRBC/ATJRBC/00002/2018"
    },

    {
      noBien: 3301787,
      descripcion: "EXHIBIDOR PUBLICITARIO",
      cantidad: 12,
      ofsol: "DCCR/DECRO/DRBC/ATJRBC/00003/2018"
    },
  ];

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

}
