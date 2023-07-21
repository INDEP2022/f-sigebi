import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { GoodsRequestModalComponent } from './goods-request-modal/goods-request-modal.component';
import { ProrrateoGoodSurveillancePolicyModalComponent } from './prorrateo-good-surveillance-policy-modal/policy-modal.component';
//import { ProrrateoGoodSurveillancePolicyModalComponent } from './prorrateo-good-surveillance-policy-modal/prorrateo-good-surveillance-policy-modal.component';

@Component({
  selector: 'app-prorrateo-goods-surveillance',
  templateUrl: './prorrateo-goods-surveillance.component.html',
  styles: [],
})
export class ProrrateoGoodsSurveillanceComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  NoRequest: any;
  date1: any;
  userDes: any;
  userSour: any;
  dataSelect: any;
  PolicyKey: any;
  policy: any;
  elemento = '';
  tipo: any;
  bandera: boolean = false;
  processed: any;
  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private securityService: SecurityService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noRequest: [null, Validators.required],
      requestDate: [null],
      dueDate: [null],
      type: [null],
      applicant: [null],
      cvePoliza: [null, Validators.required],
      requestedTo: [null],
      destinationName: [null],
      observations: [null],
      originName: [null],
      typePolicy: [null],
      description: [null],
      InsuranceCarrier: [null],
      start: [null],
      term: [null],
      processed: [null],
      dateOfAdmission: [null],
      PremiumAmount: [null],
      distribution: [null],
      zone: [null],
    });
  }
  getDataNoRequest() {
    this.form.get('noRequest').value;
    this.NoRequest = this.form.get('noRequest').value;
    this.getNoRequest(this.NoRequest);
  }

  getNoRequest(NoRequest: string | number) {
    this.policyService.getByNoRequest(NoRequest).subscribe({
      next: response => {
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
        };
        let userDes = response.RequestsXSure.usernameDestiny;
        let userSour = response.RequestsXSure.usernameSource;
        let PolicyKey = response.Policies.policyKeyId;
        this.form.patchValue(dataForm);
        this.getByUserName(userDes, true);
        this.getByUserName(userSour, false);
        this.getByPolicyKey(PolicyKey);
        this.elemento = response.Policies.policyKeyId;
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
      next: response => {
        let name = response.data[0].name;
        if (indOrigenName) {
          this.form.get('originName').setValue(name);
        } else {
          this.form.get('destinationName').setValue(name);
        }
      },
      error: error => {
        console.error(error);
      },
    });
  }
  getPolicy() {
    this.policy = this.form.get('cvePoliza').value;
    this.elemento = this.policy;
    this.getByPolicyKey(this.policy);
    this.getProcess(this.policy);
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
      Elemento: { Elemento: this.elemento },
      callback: (next: boolean) => {},
    };
    this.modalService.show(GoodsRequestModalComponent, modalConfig);
  }

  getByPolicyKey(PolicyKey: string | number) {
    this.policyService.getBypolicyKeyId(PolicyKey).subscribe({
      next: response => {
        let tipo = response.data[0].Policies.type;
        if ((tipo = 'E')) {
          this.tipo = 'Externa';
        } else {
          this.tipo = 'Interna';
        }
        const start = new Date(response.data[0].Policies.beginningDateId);
        const formattedstart = this.formatDate(start);

        const term = new Date(response.data[0].Policies.termDate);
        const formattedterm = this.formatDate(term);

        const dateOfAdmission = new Date(response.data[0].beginningDate);
        const formatteddateOfAdmission = this.formatDate(dateOfAdmission);
        let dataForm = {
          cvePoliza: response.data[0].policyKeyId,
          typePolicy: this.tipo,
          description: response.data[0].Policies.description,
          InsuranceCarrier: response.data[0].Policies.insurancecarrier,
          start: formattedstart,
          term: formattedterm,
          dateOfAdmission: formatteddateOfAdmission,
          PremiumAmount: response.data[0].Policies.amountCousin,
          Tramitado: response.data[0].process,
        };
        this.form.patchValue(dataForm);
      },
      error: err => {
        this.onLoadToast('error', err.error.message, '');
      },
    });
  }

  loadModalPolicy() {
    this.form.reset();
    this.elemento = '';
    this.openModalPolicy();
  }

  openModalPolicy() {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      Elemento: { Elemento: this.elemento },
      callback: (next: boolean) => {},
    };
    this.modalService.show(
      ProrrateoGoodSurveillancePolicyModalComponent,
      modalConfig
    );
  }

  getProcess(PolicyKey: string) {
    this.policyService.getSinister(PolicyKey).subscribe({
      next: response => {
        this.processed = response.data[0].indStatus;
        if ((this.processed = 1)) {
          this.processed = 'Si';
        } else {
          this.processed = 'No';
        }
        let dataForm = {
          processed: this.processed,
        };
        this.form.patchValue(dataForm);
      },
    });
  }
  clearform() {
    this.form.reset();
    this.elemento = '';
  }
}
