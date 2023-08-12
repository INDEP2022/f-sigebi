import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-comer-payment-virt',
  templateUrl: './new-comer-payment-virt.component.html',
  styleUrls: [],
})
export class NewComerPaymentVirt extends BasePage implements OnInit {
  formNew: FormGroup;

  incomeData: any;
  data = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private ComerLotsService: LotService,
    private bsModel: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.firstBatch();
    this.fillData();
  }

  private prepareForm() {
    this.formNew = this.fb.group({
      batch: [null],
      idBatch: [null],
      description: [null],
    });
  }

  //Gets
  get batch() {
    return this.formNew.get('batch');
  }

  get idBatch() {
    return this.formNew.get('idBatch');
  }

  get description() {
    return this.formNew.get('description');
  }

  fillData() {
    this.batch.valueChanges.subscribe(res => {
      console.log(res);
      if (res != null) {
        this.idBatch.setValue(res.idLot);
        this.description.setValue(res.description);
      } else {
        this.idBatch.reset();
        this.description.reset();
      }
    });
  }

  searchBatch(e: ListParams) {
    console.log(e);
    const paramsF = new FilterParams();
    paramsF.addFilter('lotPublic', e.text);
    paramsF.addFilter('idEvent', this.incomeData.eventId);
    paramsF.addFilter('idClient', this.incomeData.clientId);
    paramsF.addFilter(
      'idStatusVta',
      'VEN,PAG,PAGE,CAN,GARA,DES',
      SearchFilter.IN
    );
    this.ComerLotsService.getAllComerLotsFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data = new DefaultSelect(res.data, res.count);
      },
      err => {
        this.data = new DefaultSelect();
        console.log(err);
      }
    );
  }

  firstBatch() {
    const paramsF = new FilterParams();
    paramsF.addFilter('idEvent', this.incomeData.eventId);
    paramsF.addFilter('idClient', this.incomeData.clientId);
    paramsF.addFilter(
      'idStatusVta',
      'VEN,PAG,PAGE,CAN,GARA,DES',
      SearchFilter.IN
    );
    this.ComerLotsService.getAllComerLotsFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data = new DefaultSelect(res.data, res.count);
      },
      err => {
        this.data = new DefaultSelect();
        console.log(err);
      }
    );
  }

  //Cerrar modal
  close() {
    this.bsModel.hide();
  }
  
  //Generar nuevo
  saveNew(){
   
  }
}
