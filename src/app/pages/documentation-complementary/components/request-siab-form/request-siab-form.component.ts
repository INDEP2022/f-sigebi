import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-siab-form',
  templateUrl: './request-siab-form.component.html',
  styles: [],
})
export class RequestSiabFormComponent extends BasePage implements OnInit {
  requestSiabForm: FormGroup = new FormGroup({});

  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  broadStations = new DefaultSelect();
  authorities = new DefaultSelect();
  typeRelevants = new DefaultSelect();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.requestSiabForm = this.fb.group({
      regionalDelegation: [null],
      state: [null],
      transferent: [null],
      broadStation: [null],
      authority: [null],
      typeRelevant: [null],
      quantityReserve: [null, [Validators.required]],
      expedientTransferent: [null],
      descriptionRequest: [null],
      uniqueKey: [null],
      descriptionGood: [null],
      numberGoodSiab: [null],
      codeWarehouse: [null],
      numberExpedient: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}
  getStateSelect(state: ListParams) {}
  getTransferentSelect(transferent: ListParams) {}
  getBroadStationSelect(broadStation: ListParams) {}
  getAuthoritySelect(authority: ListParams) {}
  getTypeRelevantSelect(typeRelevant: ListParams) {}
}
