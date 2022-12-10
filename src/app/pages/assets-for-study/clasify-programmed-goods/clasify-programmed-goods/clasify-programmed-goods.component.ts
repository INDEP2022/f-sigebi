import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-clasify-programmed-goods',
  templateUrl: './clasify-programmed-goods.component.html',
  styles: [],
})
export class ClasifyProgrammedGoodsComponent implements OnInit {
  data: any;
  dataAssets: any;
  save: boolean = false;
  examplesRequestList: any;
  examplesListAssets: any;

  clasifyForm: FormGroup;

  isReadOnly: boolean = true;
  warehouseSelected = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.clasifyForm = this.fb.group({
      requestNumber: [{ value: '122455', disabled: true }],
      studyMotive: [{ value: 'Material de estdio', disabled: true }],
      startDate: [{ value: null, disabled: true }],
      endDate: [{ value: null, disabled: true }],
      responsableStudy: [{ value: null, disabled: true }],

      reciever: [{ value: null, disabled: true }],
      recipientPosition: [{ value: null, disabled: true }],
      warehouse: [{ value: 1447, disabled: true }],

      //dato solo para prerar solicitud, revisar si el dato biene en un solo json
      requestGoodStudy: [{ value: null, disabled: this.isReadOnly }],

      //datos extras solo para guardar respuesta de la responsable del estudio
      senseOfResponse: [{ value: 'Positivo', disabled: true }],
      responseDocument: [{ value: null, disabled: true }],
      participants: [{ value: null, disabled: true }],
    });
  }

  getListAssetsData(event: any) {
    console.log('lista de bienes');
    this.examplesListAssets = event;
  }

  getAssetDta(event?: any) {
    console.log('datos del detalle de bienes');
    this.examplesRequestList = event;
  }

  getWarehouseSelectedSelect(event: any) {}
}
