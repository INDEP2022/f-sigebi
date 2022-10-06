import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//XLSX
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-c-b-bedv-c-validation-exempted-goods',
  templateUrl: './c-b-bedv-c-validation-exempted-goods.component.html',
  styles: [
  ]
})
export class CBBedvCValidationExemptedGoodsComponent implements OnInit {

  ExcelData: any;
  CsvData:any;
  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvento: ['', [Validators.required]],
      blackList: ['', [Validators.required]],
      refundAmount: ['', [Validators.required]],
      penaltyAmount: ['', [Validators.required]],
    });
  }

  settings = {
    actions: false,

    // actions: {
    //   columnTitle: 'Acciones',
    //   // delete: false
    //  },

    //  hasScroll: false,
   //  pager: {
   //    display: false,
   //  },
 
   // hideSubHeader: false,//oculta subheaader de filtro
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
     bien: {
       title: 'Bien',
       width: '25px',
       editable: false,
      
     },
     descripcion: {
       title: 'Descripción',
       editable: false,
     },
     unidad: {
       title: 'Unidad',
       editable: false,
     },
     proceso: {
       title: 'Proceso',
     },
   },
   noDataMessage: "No se encontrarón registros"
   };

  list = [
    {
     bien: "791",
     descripcion: "FREIGHTLINER 1987 AZUL 453BK6 SPF CON CAJA REFRIGERADA CON THERMOKING 1FUEYB",
     unidad: "UNIDAD",
     proceso: "REV",
    },
    {
     bien: "1773",
     descripcion: "CARGADOR DE LA MARCA CANON, AL PARECER PARA CACULADORA",
     unidad: "PIEZA",
     proceso: "COMER",
    },
    {
     bien: "10230",
     descripcion: "SEMIREMOLQUE TIPO CAJA CERRADA",
     unidad: "PIEZA",
     proceso: "REV",
    },
  ];

  ReadExcel(event:any){

    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result, {type: 'binary'});
      var sheetNames = workbook.SheetNames;
      this.list = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
      console.log(this.list);
    }

  }


}
