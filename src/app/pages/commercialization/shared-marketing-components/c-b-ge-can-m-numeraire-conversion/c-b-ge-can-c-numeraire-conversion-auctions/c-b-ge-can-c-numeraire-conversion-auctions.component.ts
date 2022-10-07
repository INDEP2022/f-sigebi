import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-b-ge-can-c-numeraire-conversion-auctions',
  templateUrl: './c-b-ge-can-c-numeraire-conversion-auctions.component.html',
  styles: [
  ]
})
export class CBGeCanCNumeraireConversionAuctionsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      cveEvent: ['', [Validators.required]],
      nameEvent: ['', [Validators.required]],
      obsEvent: ['', [Validators.required]],
      place: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      failureDate: ['', [Validators.required]],
    });
  }

  //Tabla 1
  settings = {

    actions: {
      add: false,
      edit: false,
      delete: false,
    }, 

 
    hideSubHeader: true,//oculta subheaader de filtro
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
     idGasto: {
       title: 'ID Gasto',
     },
     descrIdGasto: {
       title: ' ',
     },
     monto: {
       title: 'Monto',
     },
     solPago: {
       title: 'Solicitud de Pago',
     },
     mandato: {
      title: 'Mandato',
    },
    total: {
      title: 'Total',
    },
    
   },
   noDataMessage: "No se encontrarón registros"
 };

 data = [
  {
    idGasto: '159',
    descrIdGasto: 'Gastos 159',
    monto: ' 132564',
    solPago: '147',
    mandato: 'mandato 1',
    total: '132711',
  }
 ]

 //Tabla 2 Dispersión
settings2 = {

  actions: {
    add: false,
    edit: false,
    delete: false,
  }, 


 hideSubHeader: true,//oculta subheaader de filtro
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
   noBien: {
     title: 'No. Bien',
   },
   monto: {
     title: 'Monto',
   },
   partConver: {
     title: 'Participa conversión',
   },
   fecha: {
     title: 'Fecha',
   },
 },
 noDataMessage: "No se encontrarón registros"
};
data2 = [
  {
    noBien: '147',
    monto: '7894',
    partConver: 'mxn',
    solPago: '147',
    fecha: '31-05-2020',
  }
 ]

}
