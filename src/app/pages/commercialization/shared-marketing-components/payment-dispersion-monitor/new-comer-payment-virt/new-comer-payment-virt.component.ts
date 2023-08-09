import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Params } from '@angular/router';
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

  data = new DefaultSelect();

  constructor(
    private fb: FormBuilder, 
    private ComerLotsService: LotService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.formNew = this.fb.group({
      batch: [null],
      idBatch: [null],
      description: [null],
    });
  }

  searchBatch(e: Params) {
    console.log(e);
    // this.ComerLotsService.getAllComerLotsFilter()
  }
}
