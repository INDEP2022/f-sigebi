/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
    selector: 'app-pj-aen-c-notification-file-update',
    templateUrl: './pj-aen-c-notification-file-update.component.html',
    styleUrls: ['./pj-aen-c-notification-file-update.component.scss']
})
export class PJAENNotificationFileUpdateComponent extends BasePage implements OnInit, OnDestroy{
    tableFactGenSettings = {
        actions: {
          columnTitle: '',
          add: false,
          edit: false,
          delete: false,
        },
        hideSubHeader: true,//oculta subheaader de filtro
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
          asunto: "5", 
          descripcion: "DOCUMENTACION COMPLEMENTARIA", 
          fechaCaptura: "18-10-2018 09:50", 
          claveAmparo: "", 
          averiguacionPrevia: "FED/JAL/GDN", 
          causaPenal: "", 
          noExpediente: "1"
        },
    
      ];
    
      public form: FormGroup;
    
    constructor(
        private fb: FormBuilder
        ) {
        super();
    }
  
    ngOnInit(): void {
        this.prepareForm();
        this.loading = true;
    }
    
    private prepareForm() {
        this.form = this.fb.group({
        noExpediente: ['', [Validators.required]],
        });}

    public get noExpediente() { return this.form.get('noExpediente'); }
    
    mostrarInfo(): any{
    console.log(this.form.value)
    }
}

  