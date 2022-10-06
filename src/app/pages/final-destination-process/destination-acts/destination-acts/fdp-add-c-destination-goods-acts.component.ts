import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

@Component({
  selector: 'app-fdp-add-c-destination-goods-acts',
  templateUrl: './fdp-add-c-destination-goods-acts.component.html',
  styles: [
  ]
})
export class FdpAddCDestinationGoodsActsComponent implements OnInit {
  bsConfig?: Partial<BsDatepickerConfig>;
  actForm: FormGroup;
  response: boolean = false;
  //datePicker config
  colorTheme = 'theme-red';

  settings1 = {
    rowClassFunction: (row: any) =>
      row.data.status ? "available" : "not-available",
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: "external",
    columns: {
      noBien: {
        title: "No. Bien",
        type: "number",
      },
      description: {
        title: "Descripcion",
        type: "string",
      },
      cantidad: {
        title: "Cantidad",
        type: "number",
      },
      acta: {
        title: "Acta",
        type: "string",
      },
    },
    noDataMessage: "No se encontrarón registros",
  };

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: "external",
    columns: {
      noBien: {
        title: "No. Bien",
        type: "number",
      },
      descripcion: {
        title: "Descripción",
        type: "string",
      },
      cantidad: {
        title: "Cantidad",
        type: "number",
      }
    },
    noDataMessage: "No se encontrarón registros",
  };


  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService
  ) { }

  ngOnInit( ): void {
    this.initForm();
  }

  setConfigDate(){
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.localeService.use('es');
    
  }

  initForm(){
    this.actForm = this.fb.group({
      statusAct: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      destinationDelivDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      destr: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      date: [null, [Validators.required]],
      act: [null, [Validators.required]],
      address: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryName: [null, [Validators.required]],
      receiverName: [null, [Validators.required]],
      auditor: [null, [Validators.required]],
      methodDestruct: [null, [Validators.required]],
      witnessContr: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
    });
  }

  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;

  search(term: string){
    this.response = !this.response;
  }

  onSubmit(){

  }


}


const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    cantidad: 1,
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    cantidad: 1,
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    cantidad: 1,
    acta: "A/PGR/6/JCS",
    status: false,
  },
  {
    noBien: 123,
    description: "INMUEBLE UBICADO EN CALLE",
    cantidad: 1,
    acta: "A/PGR/6/JCS",
    status: false,
  },
];


const EXAMPLE_DATA2 = [
  {
    noBien: 321,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    cantidad: 2,
  },
  {
    noBien: 321,
    descripcion: "UN PAR DE ARETES, METAL FANTASIA",
    cantidad: 2,
  },

];

