import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FdpMadCModalApprovalDonationComponent } from './../modal-approval-donation/fdp-mad-c-modal-approval-donation.component';
import { COLUMNS_APPROVAL_DONATION } from './columns-approval-donation';

@Component({
  selector: 'app-fdp-cad-c-capture-approval-donation',
  templateUrl: './fdp-cad-c-capture-approval-donation.component.html',
  styles: [
    `
      @media screen and (max-width: 767px) {
        #column {
          border-right: 0px !important;
        }
      }
    `,
  ],
})
export class FdpCadCCaptureApprovalDonationComponent
  extends BasePage
  implements OnInit
{
  regisForm: FormGroup;
  siabForm: FormGroup;
  bsValueToYear: Date = new Date();
  minModeToYear: BsDatepickerViewMode = 'year'; // change for month:year
  bsConfigToYear: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  data = EXAMPLE_DATA;
  info = [
    {
      id: 0,
      title: 'CONSULTA BIENES',
      color: 'grey',
    },
    {
      id: 1,
      title: 'COM. EXTERIOR KG',
      color: 'brackground-color: green',
    },
  ];

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_APPROVAL_DONATION;
  }

  ngOnInit(): void {
    this.configDatePicker();
    this.initForm();
    this.openModal('Seleccione el Área a Trabajar', 'select-area');
  }

  initForm() {
    this.regisForm = this.fb.group({
      type: [null, []],
      area: [null, []],
      year: [this.bsValueToYear, []],
      folio: [null, []],
      captureDate: [null, []],
      keyEvent: [null, []],
    });
  }

  configDatePicker() {
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.minModeToYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  onSubmit() {}

  openModal(title: string, op: string, subTitle: string = '') {
    const initialState: ModalOptions = {
      initialState: {
        title,
        op,
        subTitle,
      },
    };
    this.bsModalRef = this.modalService.show(
      FdpMadCModalApprovalDonationComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}

const EXAMPLE_DATA = [
  {
    ref: 1,
    goods: 33321,
    goodsDescrip: 'Bien Integrado',
    quantity: 7,
    unit: 'KILOGRAMO',
    status: 'ADM',
    proceedings: 1245454,
    targetTag: 'DONACION',
    transfNumb: 120,
    desTransf: 'SAT',
    clasifNumb: 778,
    process: 'TRANSFERENT',
    warehouseNumb: 28730,
    warehouse: 'DRCS ALMA',
    warehouseLocat: 'DCRS ALMA',
    coordAdmin: 'DELELGACIÓN REG.',
  },
];
