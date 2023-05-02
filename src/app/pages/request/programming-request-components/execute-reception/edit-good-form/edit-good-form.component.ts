import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  physicalStatusItems,
  stateConservationsItems,
  unitMeasure,
} from './edit-good-items';

@Component({
  selector: 'app-edit-good-form',
  templateUrl: './edit-good-form.component.html',
  styles: [],
})
export class EditGoodFormComponent extends BasePage implements OnInit {
  goodNumber: number;
  form: FormGroup = new FormGroup({});
  unitMeasures = new DefaultSelect(unitMeasure);
  physicalStatus = new DefaultSelect(physicalStatusItems);
  stateConservations = new DefaultSelect(stateConservationsItems);
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.showInfoGood();
  }

  prepareForm() {
    this.form = this.fb.group({
      observations: [null, [Validators.required]],
      goodId: [null, [Validators.required]],
      uniqueKey: [null, [Validators.required]],
      descriptionGood: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      unitMeasure: [null],
      physicalStatus: [null],
      stateConservation: [null],
    });
  }

  showInfoGood() {
    this.goodService.getById(this.goodNumber).subscribe(data => {
      if (data.stateConservation == 2 || data.physicalStatus == 2) {
        data.stateConservation = 'MALO';
        data.physicalStatus = 'MALO';
      }

      this.form.patchValue({
        observations: data.observations,
        goodId: data.goodId,
        uniqueKey: data.uniqueKey,
        descriptionGood: data.description,
        quantity: data.quantity,
        unitMeasure: data.unitMeasure,
        physicalStatus: data.physicalStatus,
        stateConservation: data.stateConservation,
      });
    });
  }

  confirm() {
    console.log(this.form.value);
  }

  close() {
    this.modalRef.hide();
  }
}
