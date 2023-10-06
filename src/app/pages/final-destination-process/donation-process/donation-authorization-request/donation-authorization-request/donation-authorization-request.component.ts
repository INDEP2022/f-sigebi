import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  IProposel,
  IRequest,
} from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DonationProcessService } from '../../../shared-final-destination/view-donation-contracts/donation-process.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
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
  requestModel: IRequest;
  requestId: number = 0;
  data: any = [];
  goodsTotals: number = 0;
  columnFilters: any[] = [];
  totalItems: number = 0;
  loadingReq: boolean = true;
  itemRequest: number = 0;
  proposal: IProposel;
  totalSunQuantity: number = 0;
  totalGoods: number = 0;
  dataFacRequest: LocalDataSource = new LocalDataSource();
  dataGoodsFact: LocalDataSource = new LocalDataSource();
  status: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  files: any = [];
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;
  selectedRow: any | null = null;
  proposalId: string = '';
  @ViewChild('file') file: any;
  paramsScreen: IParamsAuth = {
    origin: '',
    proposal: '',
  };
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private proposelServiceService: ProposelServiceService,
    private donationService: DonationService,
    private donationProcessService: DonationProcessService,
    private donAuthorizaService: DonAuthorizaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = DISTRIBUTION_COLUMNS;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = REQUEST_GOOD_COLUMN;
    this.settings3 = {
      ...this.settings,
      selectMode: 'multi',
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS_GOODS,
      },
    };
  }

  ngOnInit(): void {
    if (typeof Storage !== 'undefined') {
      const o = localStorage.getItem('proposalId');
      const r = localStorage.getItem('request');
      console.log(o);
      let params = new ListParams();
      params['proposal'] = o;
      this.getProposalId(params);
      this.requestId = Number(r);
      this.getRequest(this.requestId);
    } else {
      console.log('sin paarametro', this.proposalId);
    }
    this.initForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.proposal = paramsQuery['proposal'] ?? null;
        // this.paramsScreen.cveEvent = paramsQuery['cveEvent'] ?? null;
        if (this.origin == 'FDONSOLAUTORIZA') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          // this.origin2 = paramsQuery['origin2'] ?? null;
        }
        if (this.origin != null && this.paramsScreen.proposal != null) {
          console.log(this.paramsScreen);
        }
      });
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
      localStorage.setItem('proposalId', this.proposeDefault.ID_PROPUESTA);
      localStorage.setItem('request', this.proposeDefault.ID_SOLICITUD);
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
    this.dataFacRequest.load([]);
    localStorage.removeItem('proposal');
    localStorage.removeItem('request');
  }

  cleanForm() {
    this.form.reset();
    this.file = [];
    this.dataFacRequest.load([]);
    localStorage.removeItem('proposal');
    localStorage.removeItem('request');
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
        this.totalSunQuantity = this.request.reduce(
          (acc: any, item: any) => acc + item.sunQuantity,
          0
        );

        this.status = this.request.requestStatus;
        const o = localStorage.getItem('proposalId');
        this.form.patchValue({
          proposal: o,
          classifNumbGood: this.request[0].clasifGood.clasifGoodNumber,
          descripClassif: null,
        });
        this.formTable1.get('totals').setValue(Number(this.totalSunQuantity));
        this.getRequestGood();
      },
    });
  }
  getRequestGood() {
    this.loadingReq = true;
    // this.params.getValue()['filter.numFile'] = this.expedienteNumber;
    let params = new ListParams();
    console.log(this.requestId);
    params['requestTypeId'] = 'SD';
    params['sunStatus'] = 'A';
    this.donationService.getGoodRequest(this.requestId, params).subscribe({
      next: data => {
        this.loadingReq = false;
        this.dataGoodsFact.load(data.data);
        console.log(data.data);
        this.totalGoods = data.data.reduce(
          (acc: any, item: any) => acc + (item.gppdId.quantity ?? 0),
          0
        );
        console.log(this.totalGoods);
      },
    });
  }

  agregarBienes() {
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FDONSOLAUTORIZA' },
    });
  }
  addrequest(request?: any) {
    const o = localStorage.getItem('proposalId');
    if (o == null) {
      this.alertInfo(
        'warning',
        'No se puede crear una nueva solicitud sin selecccionar ela propuesta',
        ''
      );
      return;
    }
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      request,
    };
    let modalRef = this.modalService.show(CreateRequestComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.alert(
          'success',
          'Se cargó la información de la solicitud',
          next.proposalCve
        );
      }
    });
    // this.requestModel = {
    //   solQuantity: this.totalItems,
    //   requestId: number;
    //   entFedKey: number;
    //   requestDate: string;
    //   clasifGood: number;
    //   justification: string;
    //   sunStatus: string;
    //   proposalCve: string;
    //   requestTypeId: string;
    // }
    // this.proposelServiceService.create().subscribe({
    //   next: data => {
    //     console.log(data)
    //   }, error: () => console.log('no se guardó')
    // })
  }
  removeSelect() {}

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
      console.log(this.selectedRow);
    } else {
      this.selectedRow = null;
    }

    console.log(this.selectedRow);
  }
}

export interface IParamsAuth {
  origin: string;
  proposal: string;
}
