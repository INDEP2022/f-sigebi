import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VALIDATION_EXEMPTED_GOODS_COLUMS } from './c-b-bedv-c-validation-exempted-goods-columns';
import { EditValidationExemptedGoodsModalComponent } from '../edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';

import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-c-b-bedv-c-validation-exempted-goods',
  templateUrl: './c-b-bedv-c-validation-exempted-goods.component.html',
  styles: [],
})
export class CBBedvCValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  ExcelData: any;
  CsvData: any;
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: "Acciones",
        position: "right",
        edit: true,
        delete: false,
      },
      columns: { ...VALIDATION_EXEMPTED_GOODS_COLUMS },
    };
  }

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

  data = [
    {
      noBien: '791',
      description:
        'FREIGHTLINER 1987 AZUL 453BK6 SPF CON CAJA REFRIGERADA CON THERMOKING 1FUEYB',
      unit: 'UNIDAD',
      proccess: 'REV',
    },
    {
      noBien: '1773',
      description: 'CARGADOR DE LA MARCA CANON, AL PARECER PARA CACULADORA',
      unit: 'PIEZA',
      proccess: 'COMER',
    },
    {
      noBien: '10230',
      description: 'SEMIREMOLQUE TIPO CAJA CERRADA',
      unit: 'PIEZA',
      proccess: 'REV',
    },
  ];

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.data);
    };
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  openModal(context?: Partial<EditValidationExemptedGoodsModalComponent>) {
    const modalRef = this.modalService.show(EditValidationExemptedGoodsModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(allotment?: any) {
     this.openModal({ allotment });
   }
}
