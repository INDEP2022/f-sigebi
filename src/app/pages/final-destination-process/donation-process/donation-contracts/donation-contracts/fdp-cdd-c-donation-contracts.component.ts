import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalSelectRequestsComponent } from '../modal-select-requests/modal-select-requests.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-fdp-cdd-c-donation-contracts',
  templateUrl: './fdp-cdd-c-donation-contracts.component.html',
  styles: [],
})
export class FdpCddCDonationContractsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;
  bsModalRef?: BsModalRef;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  minModeFromYear: BsDatepickerViewMode = 'year';

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
    this.configInputsDate();
  }

  initForm() {
    this.form = this.fb.group({
      idContract: [null, [Validators.required]],
      cto: [null, [Validators.required]],
      status: [null, [Validators.required]],
      trans: [null, [Validators.required]],
      don: [null, [Validators.required]],
      ctrlAut: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      key: [null, [Validators.required]],
      cve: [null, [Validators.required]],
      donee: [null, [Validators.required]],
      reasonSocial: [null, [Validators.required]],
      subscribeDate: [null, [Validators.required]],
      domicilie: [null, [Validators.required]],
      nameRepDon: [null, [Validators.required]],
      positionRepDon: [null, [Validators.required]],
      nameRepSae: [null, [Validators.required]],
      nameFunSae: [null, [Validators.required]],
      positionFunSae: [null, [Validators.required]],
      witness1: [null, [Validators.required]],
      witness2: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      deliveryDate: [null, [Validators.required]],
      folioScan: [null, [Validators.required]],
      contractStatus: [null, [Validators.required]],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }

  configInputsDate() {
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MMMM',
      }
    );
  }

  openModal() {
    this.bsModalRef = this.modalService.show(ModalSelectRequestsComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.setClass('modal-lg');
  }
}
