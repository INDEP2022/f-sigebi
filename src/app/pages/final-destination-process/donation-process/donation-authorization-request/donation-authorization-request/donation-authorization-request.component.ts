import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import {
  IDeleteGoodDon,
  IInventaryRequest,
  IProposel,
  IRequest,
} from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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
  COLUMNS_INVENTARY,
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
  inventaryModel: IInventaryRequest;
  inventaryAll: IInventaryRequest[] = [];
  dataTableGood_: any[] = [];
  proposalCve: string = '';
  dataReqest: any;
  request: any;
  donationGood: IGoodDonation[] = [];
  settings2: any;
  settings3: any;
  totalItemsGood: number = 0;
  goods: any[];
  dataFactInventary: LocalDataSource = new LocalDataSource();
  requestModel: IRequest;
  requestId: number = 0;
  data: any = [];
  good: IGood;
  goodsTotals: number = 0;
  columnFilters: any[] = [];
  totalItems: number = 0;
  loadingReq: boolean = true;
  goodLoading: boolean = true;
  loading2: boolean = true;
  totalItemsIn: number = 0;
  itemRequest: number = 0;
  settings4: any;
  proposal: IProposel;
  totalSunQuantity: number = 0;
  totalGoods: number = 0;
  dataFacRequest: LocalDataSource = new LocalDataSource();
  dataGoodsFact: LocalDataSource = new LocalDataSource();
  status: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  files: any = [];
  Exportdate: boolean = false;
  goodNotValid: IGood[] = [];
  origin: string = null;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;
  dataTableGood: LocalDataSource = new LocalDataSource();
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
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodService: GoodService
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
    this.settings4 = {
      ...this.settings,
      // selectMode: 'multi',
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS_INVENTARY,
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
      localStorage.setItem('requestId', String(this.requestId));
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
      this.formTable1.reset();
      this.formTable2.reset();
      this.formTable3.reset();
      this.dataGoodsFact.load([]);
      this.dataFactInventary.load([]);
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
    this.loadingReq = true;
    this.loading2 = false;
    this.goodLoading = false;
    this.donationProcessService.getRequestId(proposal).subscribe({
      next: data => {
        this.loadingReq = false;
        this.request = data.data;
        this.dataFacRequest.load(this.request);
        this.dataFacRequest.refresh();
        this.proposalCve = this.request.proposalKey;
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
      },
      error: () => {
        this.loadingReq = false;
      },
    });
  }
  getRequestGood() {
    this.goodLoading = true;
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(this.requestId);
    params['sortBy'] = 'goodId:DESC';
    params['requestTypeId'] = 'SD';
    params['good.noDelegation'] = this.requestModel.entFedKey;
    params['request.requestId'] = this.requestId;
    params['good.status'] = 'DON' || 'ADA';
    this.donationService.getGoodRequest(params).subscribe({
      next: data => {
        this.goodLoading = false;
        this.goods = data.data;
        this.totalItemsGood = data.count;
        this.dataGoodsFact.load(this.goods);
        console.log(this.goods);
        this.totalGoods = this.goods.reduce(
          (acc: any, item: any) =>
            acc + this.convert(item.allotmentAmount) ?? 0,
          0
        );
        console.log(this.totalGoods);
        this.formTable2.get('quantityToAssign').setValue(this.totalGoods);
      },
      error: () => {
        this.goodLoading = false;
      },
    });
  }

  getInventary() {
    this.loading2 = true;
    console.log(this.inventaryModel);
    this.donationService.getInventaryGood(this.inventaryModel).subscribe({
      next: data => {
        this.loading2 = false;
        this.inventaryModel = data;
        console.log(data);
        // console.log(this.inventaryAll);
        this.totalItemsIn = data.count;
        this.dataFactInventary.load(data);
        this.dataFactInventary.refresh();
      },
      error: () => {
        this.loading2 = false;
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

  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  async addSelect() {
    if (this.selectedGooods.length > 0) {
      if (this.proposeDefault == null) {
        this.alert(
          'warning',
          'No existe una propuesta en la cual asignar el bien.',
          'Debe capturar un acta.'
        );
        return;
      } else {
        if (this.status == 'A') {
          this.alert(
            'warning',
            'La propuesta ya está autorizada, no puede realizar modificaciones',
            ''
          );
          return;
        } else {
          // console.log('aaa', this.goods);
          let result = this.selectedGooods.map(async (good: any) => {
            if (good.di_acta != null) {
              this.alert(
                'warning',
                `Ese bien ya se encuentra en la propuesta ${good.di_acta}`,
                'Debe capturar una nueva propuesta.'
              );
            } else if (good.di_disponible == 'N') {
              this.onLoadToast(
                'warning',
                `El bien ${good.id} tiene un estatus inválido para ser asignado a alguna propuesta`
              );
              return;
            } else {
              // console.log('GOOD', good);
              this.loading2 = true;

              if (!this.request.some((v: any) => v === good)) {
                let indexGood = this.dataTableGood_.findIndex(
                  _good => _good.id == good.id
                );

                this.Exportdate = true;
                console.log('indexGood', indexGood);
                if (indexGood != -1)
                  this.dataTableGood_[indexGood].di_disponible = 'N';
                let obj = {
                  pActaNumber: this.requestId,
                  pStatusActa: 'A',
                  pVcScreen: 'FDONSOLAUTORIZA',
                  pUser: this.authService.decodeToken().preferred_username,
                };
                await this.updateGoodEInsertHistoric(obj);
                await this.updateBienDetalle(good.id, 'ADA');
                await this.createDET(this.inventaryModel);
              }
            }
          });
          Promise.all(result).then(async item => {
            //ACTUALIZA EL COLOR
            this.dataTableGood_ = [];
            this.dataTableGood.load(this.dataTableGood_);
            this.dataTableGood.refresh();
            //this.getGoodsByStatus(this.fileNumber);
            await this.getRequest(Number(localStorage.getItem('proposal')));
          });
        }
      }
    } else {
      this.alert('warning', 'Seleccione primero el bien a asignar.', '');
    }
  }
  async createDET(good: IInventaryRequest) {
    let obj: any = {
      proposalKey: this.requestModel.proposalCve,
      numberGood: good.goodNumber,
    };

    await this.saveGoodInventary(obj);
  }

  async saveGoodInventary(body: IInventaryRequest) {
    return new Promise((resolve, reject) => {
      this.donationService.createInventary(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
          this.Exportdate = true;
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }
  async updateBienDetalle(idGood: string | number, status: string) {
    this.goodService.updateStatusActasRobo(idGood, status).subscribe({
      next: data => {
        console.log(data);
        this.getRequestGood();
      },
      error: () => (this.loading = false),
    });
  }

  removeSelect() {
    if (this.proposal == null) {
      this.alert(
        'warning',
        'Debe especificar/buscar la propuesta para luego eliminar el bien.',
        ''
      );
      return;
    } else if (this.goods.length == 0) {
      this.alert(
        'warning',
        'Debe seleccionar un bien que Forme parte de la solicitud primero',
        'Debe capturar el bien.'
      );
      return;
    } else if (this.status == 'A') {
      this.alert(
        'warning',
        'La propuesta ya está autorizada, no puede realizar modificaciones',
        ''
      );
      return;
    } else {
      this.alertQuestion(
        'question',
        '¿Seguro que desea eliminar el bien de la solicitud?',
        ''
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          if (this.selectedGooods.length > 0) {
            // this.goods = this.goods.concat(this.selectedGooodsValid);
            let result = this.selectedGooods.map(async good => {
              console.log('good', good);
              this.goods = this.goods.filter(
                (_good: any) => _good.id != good.goodId.goodNumber
              );
              let index = this.dataTableGood_.findIndex(
                g => g.id === good.goodId.goodNumber
              );
              // await this.updateBienDetalle(good.goodId, 'ADA');

              //ACTUALIZA COLOR
              this.dataTableGood_ = [];
              this.dataTableGood.load(this.dataTableGood_);
              this.dataTableGood.refresh();

              let obj = {
                pActaNumber: this.requestId,
                pStatusActa: 'SD',
                pVcScreen: 'FDONSOLAUTORIZA',
                pUser: this.authService.decodeToken().preferred_username,
              };
              await this.updateGoodEInsertHistoric(obj);
              await this.deleteDET(good.goodId);
            });

            Promise.all(result).then(async item => {
              await this.getRequest(Number(localStorage.getItem('proposal')));

              // this.getGoodsByStatus(Number(this.fileNumber));
            });
            this.Exportdate = false;
            this.selectedGooodsValid = [];
          }
        }
      });
    }
  }
  async updateGoodEInsertHistoric(obj: {
    pActaNumber: any;
    pStatusActa: string;
    pVcScreen: string;
    pUser: string;
  }) {
    //throw new Error('Method not implemented.');
  }

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
      this.form
        .get('classifNumbGood')
        .setValue(this.selectedRow.clasifGoodNumber);
      this.form.get('descripClassif').setValue(this.selectedRow.clasifGood);
      this.inventaryModel = {
        proposalKey: this.requestModel.proposalCve ?? '',
        goodNumber: this.selectedRow.goodId,
      };
    } else {
      this.selectedRow = null;
    }
  }
  requestSelected(row: any): void {
    if (row.isSelected) {
      this.requestModel = row.data;
      console.log(this.requestModel.proposalCve);
      console.log(this.requestModel);
      this.getRequestGood();
    } else {
      this.requestModel = null;
    }
  }

  convert(amount: number) {
    const numericAmount = parseFloat(String(amount));
    if (!isNaN(numericAmount)) {
      return numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      });
    } else {
      return amount;
    }
  }

  async deleteDET(good: IDeleteGoodDon) {
    console.log(good);
    const valid: any = await this.getGoodsDelete(good.goodId);
    if (valid != null) {
      let objDelete = {
        requestId: this.requestId,
        goodId: good.goodId,
        requestTypeId: this.request.requestTypeId,
      };

      await this.deleteDetailProcee(objDelete);
    }
  }
  async getGoodsDelete(id: any) {
    const params = new ListParams();
    params['goodId'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.donationService.getGoodRequest(params).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async deleteDetailProcee(body: IDeleteGoodDon) {
    return new Promise((resolve, reject) => {
      this.donationService.deleteGoodDon(body).subscribe({
        next: data => {
          console.log('data', data);
          // this.loading2 = false;
          resolve(true);
        },
        error: error => {
          // this.loading2 = false;
          resolve(false);
        },
      });
    });
  }
}

export interface IParamsAuth {
  origin: string;
  proposal: string;
}
