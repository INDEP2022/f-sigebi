import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProposel } from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DonationProcessService } from '../../../shared-final-destination/view-donation-contracts/donation-process.service';
import { FindProposeComponent } from '../find-propose/find-propose.component';
import { ModalViewComponent } from '../modal-view/modal-view.component';
import { ListParams } from './../../../../../common/repository/interfaces/list-params';
import { COLUMNS_GOODS } from './columns-goods';
import {
  DISTRIBUTION_COLUMNS,
  REQUEST_GOOD_COLUMN,
} from './distribution-columns';
import { DonAuthorizaService } from './service/don-authoriza.service';
@Component({
  selector: 'app-donation-authorization-request',
  templateUrl: './donation-authorization-request.component.html',
  styles: [],
})
export class DonationAuthorizationRequestComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTable3: FormGroup;
  request: any;
  donationGood: IGoodDonation[] = [];
  settings2: any;
  settings3: any;
  goods: any[];
  requestId: number = 0;
  data: any = [];
  columnFilters: any[] = [];
  totalItems: number = 0;
  loadingReq: boolean = true;
  itemRequest: number = 0;
  proposal: IProposel;
  dataFacRequest: LocalDataSource = new LocalDataSource();
  status: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  files: any = [];
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;
  @ViewChild('file') file: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private proposelServiceService: ProposelServiceService,
    private donationService: DonationService,
    private donationProcessService: DonationProcessService,
    private donAuthorizaService: DonAuthorizaService,
    private router: Router
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = DISTRIBUTION_COLUMNS;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = REQUEST_GOOD_COLUMN;
    this.settings3 = { ...this.settings, actions: false };
    this.settings3.columns = COLUMNS_GOODS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      proposal: [null],
      classifNumbGood: [null],
      descripClassif: [null],
    });

    this.formTable1 = this.fb.group({
      totals: [null, []],
    });

    this.formTable2 = this.fb.group({
      quantityToAssign: [null, []],
    });

    this.formTable3 = this.fb.group({
      quantityToAssign: [null, []],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }
  loadGoods() {
    this.donAuthorizaService.loadGoods.next(true);
  }

  openModal(op: number) {
    const initialState: ModalOptions = {
      initialState: {
        op,
      },
    };
    this.bsModalRef = this.modalService.show(ModalViewComponent, initialState);
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  proposeDefault: any = null;
  findPropose(propose?: string) {
    const regActual = this.proposeDefault;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      propose,
      regActual,
    };

    let modalRef = this.modalService.show(FindProposeComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se cargó la información de la Propuesta',
          next.ID_PROPUESTA
        );
      }
      this.form.reset();
      this.proposeDefault = next;
      await this.getProposalId(this.proposeDefault.ID_PROPUESTA);
      this.requestId = this.proposeDefault.ID_SOLICITUD;
      await this.getRequest(this.requestId);
    });
    modalRef.content.cleanForm.subscribe(async (next: any) => {
      if (next) {
        this.cleanPropose();
      }
    });
  }
  cleanPropose() {
    this.form.reset();
    this.proposeDefault = null;
  }

  cleanForm() {
    this.form.reset();
    this.file = [];
  }
  async getProposalId(params: ListParams) {
    this.proposelServiceService.getIdPropose(params).subscribe({
      next: data => {
        this.proposal = data;
      },
      error: () => console.log('error in proposal'),
    });
  }
  async getRequest(proposal: number) {
    this.donationProcessService.getRequestId(proposal).subscribe({
      next: data => {
        this.request = data.data;
        this.dataFacRequest.load(this.request);
        this.dataFacRequest.refresh();
        this.itemRequest = data.count;
        console.log(this.request);
        this.status = this.request.requestStatus;
        this.form.patchValue({
          proposal: this.proposeDefault.ID_PROPUESTA,
          classifNumbGood: this.request[0].clasifGood.clasifGoodNumber,
          descripClassif: this.request[0].justification,
        });
        this.getRequestGood();
      },
    });
  }
  getRequestGood() {
    this.loadingReq = true;
    // this.params.getValue()['filter.numFile'] = this.expedienteNumber;
    let params = new ListParams();
    params['?filter.requestId.id'] = this.requestId;
    params['requestTypeId'] = 'SD';
    this.donationService.getGoodRequest(params).subscribe({
      next: data => {
        this.loadingReq = false;
        console.log(data.data);
      },
    });
  }

  agregarBienes() {
    if (this.proposeDefault === null) {
      this.alert('warning', 'Debe seleccionar la propuesta', '');
      return;
    }
    // this.data.load([]);
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FDONSOLAUTORIZA' },
    });
  }
}
