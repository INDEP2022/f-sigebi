import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-c-b-rdodi-c-reclass-recovery-orders',
  templateUrl: './c-b-rdodi-c-reclass-recovery-orders.component.html',
  styles: [
  ]
})
export class CBRdodiCReclassRecoveryOrdersComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idOi: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1), Validators.pattern(NUMBERS_PATTERN)]],
      idArea:['', [Validators.required]],
      ur:['', [Validators.required]],
      clientRFC:['', [Validators.required]],
      descripRFC:['', [Validators.required]],
      anexo:['', [Validators.required]],
      tiPe:['', [Validators.required]],
      idEvent:['', [Validators.required]],
      concept:['', [Validators.required]],
      idBank:['', [Validators.required]],
      ordenDate:['', [Validators.required]],
      numovto:['', [Validators.required]],
      amount:['', [Validators.required]],
      reference:['', [Validators.required]],
      idPayment:['', [Validators.required]],

      
    });
  }

  settings = {

    actions: {
      add: false,
      edit: false,
      delete: false,
    }, 

    hideSubHeader: true, //oculta subheaader de filtro
    // mode: 'external', // ventana externa

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
     lote: {
       title: 'Lote',
     },
     descripcion: {
       title: 'Descripción',
     },
     mandato: {
       title: 'Mandato',
     },
     importe: {
       title: 'Importe',
     },
     importeSinIva: {
      title: 'Importe sin IVA',
    },
    IVA: {
      title: 'IVA',
    },
    tipoIngreso: {
      title: 'Tipo de Ingreso',
    },
    pagoIva: {
      title: 'Pago de IVA',
    },
    precioVta: {
      title: 'Precio Venta',
    },
    ret: {
      title: 'Ret',
    },
    retenido: {
      title: 'retenido',
    },
   },
   noDataMessage: "No se encontrarón registros"
  };

  data = [
    {
      lote: 'lote 1',
      descripcion: 'descripción del lote 1',
      mandato: 'Mandato 1',
      importe: '100',
      importeSinIva: '16',

    },
    {
      lote: 'lote 2',
      descripcion: 'descripción del lote 2',
      mandato: 'Mandato 2',
      importe: '100',
      importeSinIva: '16',

    },
    {
      lote: 'lote 3',
      descripcion: 'descripción del lote 3',
      mandato: 'Mandato 3',
      importe: '100',
      importeSinIva: '16',

    }
  ]


}
