import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { formatDate } from '@angular/common';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { GoodsRequestModalComponent } from './goods-request-modal/goods-request-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GoodService } from 'src/app/core/services/good/good.service';

@Component({
  selector: 'app-prorrateo-goods-surveillance',
  templateUrl: './prorrateo-goods-surveillance.component.html',
  styles: [],
})
export class ProrrateoGoodsSurveillanceComponent implements OnInit {
  form: FormGroup;
  NoRequest: any;
  date1: any;
  userDes: any;
  userSour: any;
  dataSelect: any;
  PolicyKey: any;

  constructor(private fb: FormBuilder,
    private policyService: PolicyService,
    private securityService: SecurityService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noRequest: [
        null,
        Validators.required,
      ],
      requestDate: [
        null,
        Validators.required,
      ],
      dueDate: [null, Validators.required],
      type: [null, Validators.required],
      applicant: [null, Validators.required],
      cvePoliza: [null, Validators.required],
      requestedTo: [null, Validators.required],
      destinationName: [null, Validators.required],
      observations: [null, Validators.required],
      originName: [null, Validators.required],
      typePolicy: [null, Validators.required],
      description: [null, Validators.required],
      InsuranceCarrier: [null, Validators.required,],
      start: [null, Validators.required],
      term: [null, Validators.required],
      processed: [null, Validators.required],
      dateOfAdmission: [null, Validators.required],
      PremiumAmount: [null, Validators.required],
      distribution: [null, Validators.required,],
      zone: [null, Validators.required],
    });
  }
  getDataNoRequest() {
    this.form.get('noRequest').value;
    console.log(this.form.get('noRequest').value);
    this.NoRequest = this.form.get('noRequest').value;
    this.getNoRequest(this.NoRequest);
  }

  getNoRequest(NoRequest: string | number) {
    this.policyService.getByNoRequest(NoRequest).subscribe({
      next: (response) => {
        //console.log("Response: ", response);
        const requestDate = new Date(response.RequestsXSure.requestDate);
        const formattedRequestDate = this.formatDate(requestDate);

        const dueDate = new Date(response.RequestsXSure.expirationDate);
        const formattedDueDate = this.formatDate(dueDate);

        let dataForm = {
          requestDate: formattedRequestDate,
          dueDate: formattedDueDate,
          type: response.RequestsXSure.type,
          applicant: response.RequestsXSure.usernameSource,
          requestedTo: response.RequestsXSure.usernameDestiny,
          observations: response.RequestsXSure.observations,
        }
        let userDes = response.RequestsXSure.usernameDestiny;
        let userSour = response.RequestsXSure.usernameSource;
        let PolicyKey = response.Policies.policyKeyId;
        this.form.patchValue(dataForm);
        this.getByUserName(userDes, true);
        this.getByUserName(userSour, false);
        this.getByPolicyKey(PolicyKey);

      },
      error: error => {
        console.error(error);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }

  getByUserName(desName: string, indOrigenName: boolean) {
    this.securityService.getUser(desName).subscribe({
      next: (response) => {
        let name = response.data[0].name
        if (indOrigenName) {
          this.form.get("originName").setValue(name);
        } else {
          this.form.get("destinationName").setValue(name);
        }
      },
      error: error => {
        console.error(error);
      },
    });
  }

  loadModal() {
    this.NoRequest = this.form.get('noRequest').value;
    this.openModal(false, this.NoRequest);
  }

  openModal(newOrEdit: boolean, noRequest: any) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      noRequest,
      callback: (next: boolean) => {

      },
    };
    this.modalService.show(GoodsRequestModalComponent, modalConfig);
  }

  getByPolicyKey(PolicyKey: string | number) {
    console.log("POLIcy: ", PolicyKey);
    this.policyService.getBypolicyKeyId(PolicyKey).subscribe({
      next: response => {
        let dataForm = {
          cvePoliza: response.data[0].policyKeyId,
          typePolicy: response.data[0].Policies.type,
          description: response.data[0].Policies.description,
          InsuranceCarrier: response.data[0].Policies.insurancecarrier,
          start: response.data[0].Policies.beginningDateId,
          term: response.data[0].Policies.termDate,
          dateOfAdmission: response.data[0].beginningDate,
          PremiumAmount: response.data[0].Policies.amountCousin,

        }
        this.form.patchValue(dataForm);
      },

      error: err => {
        console.log(err);
      },
    });

  }



}
