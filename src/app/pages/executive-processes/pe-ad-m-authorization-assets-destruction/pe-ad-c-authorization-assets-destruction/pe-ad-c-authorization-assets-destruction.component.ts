import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-ad-c-authorization-assets-destruction',
  templateUrl: './pe-ad-c-authorization-assets-destruction.component.html',
  styles: [
  ]
})
export class PeAdCAuthorizationAssetsDestructionComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idExp: ['', [Validators.required]],
      preInquiry: ['', [Validators.required]],
      criminalCase: ['', [Validators.required]],
      circumstAct: ['', [Validators.required]],
      touchPenalty: ['', [Validators.required]],
      noAuth: ['', [Validators.required]],
      authNotice: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
    });
  }

  settings = {

    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },

    hideSubHeader: true,//oculta subheaader de filtro
    mode: 'external', // ventana externa

    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    
    /*
    */
    columns: {
      noBien: {
        title: 'No. Bien',
      },
      description: {
        title: 'Descripción',
      },
      ubiExact: {
        title: 'Ubicación Exacta',
      },
      direction: {
        title: '',
      },
      noOficio: {
        title: 'No. de Autorización',
      },
      fecha: {
        title: 'Fecha',
      },
      status: {
        title: 'Estatus',
      },
      extraDom: {
        title: 'Ext. Dom',
      },
    },
  };

  data = [
    {
      noBien: 1448,
      description: "CUARENTA Y DOS CHAMARRAS",
      ubiExact: "ALMACEN",
      direction: "PROLONGACIÓN MORELOS",
      noOficio: "DG/006/2004",
      fecha: "12/12/2005",
      status: "ADE",
      extraDom: "DECOMISO",
    },
    {
      noBien: 1449,
      description: "SETENTA Y DOS CELULARES",
      ubiExact: "ALMACEN",
      direction: "PROLONGACIÓN MORELOS",
      noOficio: "DG/006/2004",
      fecha: "12/12/2005",
      status: "ADE",
      extraDom: "DECOMISO",
    },
    {
      noBien: 1450,
      description: "CUARENTA Y TRES CABLES USB",
      ubiExact: "ALMACEN",
      direction: "PROLONGACIÓN MORELOS",
      noOficio: "DG/006/2004",
      fecha: "12/12/2005",
      status: "ADE",
      extraDom: "DECOMISO",
    },

  ];

}
