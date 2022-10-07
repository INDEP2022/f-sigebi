import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-c-b-ge-can-c-numeraire-conversion-error',
  templateUrl: './c-b-ge-can-c-numeraire-conversion-error.component.html',
  styles: [
  ]
})
export class CBGeCanCNumeraireConversionErrorComponent implements OnInit {

  list: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  //Tabla 1
  settings = {

    actions: false,

    //  hasScroll: false,
   //  pager: {
   //    display: false,
   //  },
 
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
     evento: {
       title: 'Evento',
       width: '60px'
     },
     lote: {
       title: 'Lote',
       width: '60px'
     },
     inconsistencia: {
       title: 'Inconsistencia',
     },
    
   },
   noDataMessage: "No se encontrarón registros"
 };


}
