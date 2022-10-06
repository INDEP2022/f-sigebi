import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//XLSX
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pe-amdvda-c-update-mss-value',
  templateUrl: './pe-amdvda-c-update-mss-value.component.html',
  styles: [
  ]
})
export class PeAmdvdaCUpdateMssValueComponent implements OnInit {

  ExcelData:any;
  form: FormGroup = new FormGroup({}); 
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      readRecords: ['', []],
      processedRecords: ['', []],
      
    });
  }

  settings = {

    actions: false,
    hideSubHeader: true,

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
      solicitante: {
        title: 'Solicitante',
        width: '25px'
      },
      fecavaluo: {
        title: 'Fecha de Avalúo',
      },
      institucion: {
        title: 'Institución',
      },
      perito: {
        title: 'Perito',
      },
      observ: {
        title: 'Observaciones',
      },
      nobien: {
        title: 'No. Bien',
      },
      valoravaluo: {
        title: 'Valor avalúo',
      },
      moneda: {
        title: 'Moneda',
      },
    },
    noDataMessage: "No se encontrarón registros"
  };

  ReadExcel(event:any){

    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result, {type: 'binary'});
      var sheetNames = workbook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
      console.log(this.ExcelData);
    }

  }

}
