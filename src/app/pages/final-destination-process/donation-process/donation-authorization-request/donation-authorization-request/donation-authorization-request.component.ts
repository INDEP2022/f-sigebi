import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodDonation } from 'src/app/core/models/ms-donation/donation.model';
import {
  IDeleteGoodDon,
  IInventaryDelete,
  IInventaryRequest,
  IProposel,
  IRequest,
} from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DonationProcessService } from '../../../shared-final-destination/view-donation-contracts/donation-process.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { FindProposeComponent } from '../find-propose/find-propose.component';
import { ModalViewComponent } from '../modal-view/modal-view.component';
import { ListParams } from './../../../../../common/repository/interfaces/list-params';
import {
  COLUMNS_INVENTARY,
  DISTRIBUTION_COLUMNS,
  REQUEST_GOOD_COLUMN,
} from './distribution-columns';
import { DonAuthorizaService } from './service/don-authoriza.service';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};
interface NotData {
  id: number;
  reason: string;
}
@Component({
  selector: 'app-donation-authorization-request',
  templateUrl: './donation-authorization-request.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
      .disabled-input {
        color: #939393;
        pointer-events: none;
      }
      #bienes table:not(.normal-hover) tbody tr:hover {
        color: black !important;
        font-weight: bold;
      }
      .row-verde {
        background-color: green;
        font-weight: bold;
      }

      .row-negro {
        background-color: black;
        font-weight: bold;
      }
      .registros-movidos {
        background-color: yellow;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class DonationAuthorizationRequestComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTable3: FormGroup;
  delGood: IDeleteGoodDon;
  showError: boolean = false;
  idsNotExist: NotData[] = [];
  selectedGood: IGoodAndAvailable;
  deleteInv: IInventaryDelete;
  inventaryModel: IInventaryRequest;
  dataTableGoods: IGoodAndAvailable[] = [];
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
  previousSelecteds: IGood[] = [];
  pageSelecteds: number[] = [];
  goodsTotals: number = 0;
  columnFilters: any[] = [];
  columnFilters2: any[] = [];
  columnFilters3: any[] = [];
  totalItems: number = 0;
  loadingReq: boolean = true;
  goodLoading: boolean = true;
  loading2: boolean = true;
  totalItemsIn: number = 0;
  itemRequest: number = 0;
  settings4: any;
  proposal: IProposel;
  totalSunQuantity: number = 0;
  totalGoods: number[];
  dataFacRequest: LocalDataSource = new LocalDataSource();
  dataGoodsFact: LocalDataSource = new LocalDataSource();
  status: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;
  // files: any = [];
  fromF: string = '';
  Exportdate: boolean = false;
  goodNotValid: IGood[] = [];
  origin: string = null;
  history: IHistoryGood;
  changeDescription: string;
  changeDescriptionAlterning: string;
  contador = 0;
  dataTableGood: LocalDataSource = new LocalDataSource();
  selectedRow: any | null = null;
  proposalId: string = '';
  $trackedGoods = this.store.select(getTrackedGoods);
  ngGlobal: any;
  @Input() fillData: Function;
  @ViewChild('file') file: any;
  @Input() set files(files: any[]) {
    // debugger;
    if (files.length === 0) return;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }
  @ViewChild('table') table: Ng2SmartTableComponent;

  get ids() {
    return this.donAuthorizaService.ids;
  }

  set ids(value) {
    this.donAuthorizaService.ids = value;
  }

  get selectedGooods() {
    return this.donAuthorizaService.selectedGooods;
  }

  set selectedGooods(value) {
    this.donAuthorizaService.selectedGooods = value;
  }

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
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodService: GoodService,
    private changeDetectorRef: ChangeDetectorRef,
    private historyGoodService: HistoryGoodService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = DISTRIBUTION_COLUMNS;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = REQUEST_GOOD_COLUMN;
    this.settings3 = {
      ...this.settings,
      // selectMode: 'multi',
      hideSubHeader: false,
      actions: false,
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelectedValid(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelectValid(instance),
        },
        requestId: {
          title: 'No. Solicitud',
          type: 'number',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.requestId;
          },
        },
        regionalDelegationId: {
          title: 'DON. Entidad Federal',
          type: 'number',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.request?.regionalDelegationId;
          },
        },
        goodId: {
          title: 'No. Bien Ent. Federal',
          type: 'number',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.goodId;
          },
        },
        description: {
          title: 'Descripción',
          type: 'string',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.good?.description;
          },
        },

        status: {
          title: 'Sdo./ Estatus',
          type: 'string',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.good?.status;
          },
        },
        allotmentAmount: {
          title: 'Cantidad',
          type: 'number',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.allotmentAmount;
          },
        },
        rowClassFunction: (row: any) => {
          if (row.data.di_disponible == 'S') {
            return 'bg-success text-white';
          } else {
            return 'bg-dark text-white';
          }
        },
      },
    };
    this.settings4 = {
      ...this.settings,
      selectMode: 'multi',
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS_INVENTARY,
      },
    };
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.files);
    console.log(this.fillSelectedRows);
    if (typeof Storage !== 'undefined') {
      let params = new ListParams();
      params['proposal'] = localStorage.getItem('proposalId');
      this.proposalId = localStorage.getItem('proposalId');
      this.getProposalId(params);
      this.requestId = Number(localStorage.getItem('request'));
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
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }
  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.goodId == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      console.log(good);
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.goodId
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }
  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
      console.log(this.selectedGooodsValid);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }

  settingsChange(event: any) {
    this.settings = event;
  }
  loadGoods() {
    this.donAuthorizaService.loadGoods.next(true);
  }
  async selectData(event: { data: IRequest; selected: any }) {
    this.selectedRow = event.data;
    this.form
      .get('classifNumbGood')
      .setValue(this.selectedRow.clasifGoodNumber);
    this.form.get('descripClassif').setValue(this.selectedRow.clasifGood);
    this.inventaryModel = {
      proposalKey: this.proposalCve ?? '',
      goodNumber: this.selectedRow.goodId,
      goodEntity: this.selectedRow.goodId,
    };
    this.selectedGooods = event.selected;
    this.changeDetectorRef.detectChanges();
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
      localStorage.setItem('proposalId', next.ID_PROPUESTA);
      localStorage.setItem('request', next.ID_SOLICITUD);
      await this.getProposalId(next.ID_PROPUESTA);
      this.requestId = next.ID_SOLICITUD;
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
    this.formTable1.reset();
    this.formTable2.reset();
    this.formTable3.reset();
    this.dataGoodsFact.load([]);
    this.dataFactInventary.load([]);
    this.dataFactInventary.refresh();
    this.proposeDefault = null;
    this.dataGoodsFact.refresh();
    this.dataFacRequest.load([]);
    localStorage.removeItem('proposalId');
    localStorage.removeItem('request');
  }

  cleanForm() {
    this.form.reset();
    this.formTable1.reset();
    this.formTable2.reset();
    this.formTable3.reset();
    this.dataGoodsFact.load([]);
    this.dataGoodsFact.refresh();
    this.dataFactInventary.load([]);
    this.dataFactInventary.refresh();

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
    this.donationProcessService.getRequestId(proposal).subscribe({
      next: data => {
        this.loadingReq = false;
        console.log(data.data);
        this.request = data.data;
        this.loading2 = false;
        this.dataFacRequest.load(this.request);
        this.dataFacRequest.refresh();
        this.proposalCve = this.request.proposalKey;
        localStorage.setItem('cvePropose', this.request.proposalKey);
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
      error: () => {
        this.loadingReq = false;
      },
    });
  }
  getRequestGood() {
    this.goodLoading = true;
    let params2: any = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    console.log(this.requestId);
    params2['sortBy'] = 'goodId:DESC';
    params2['requestTypeId'] = 'SD';
    params2['good.noDelegation'] = this.request.cveEvent ?? 0;
    params2['request.requestId'] = this.requestId;
    params2['good.status'] = 'DON' || 'ADA';
    this.donationService.getGoodRequest(params2).subscribe({
      next: data => {
        this.goodLoading = false;
        this.goods = data.data;
        this.totalItemsGood = data.count;
        this.dataGoodsFact.load(this.goods);
        console.log(this.goods);
        this.totalGoods = this.goods.reduce(
          (acc: any, item: any) => acc + item.allotmentAmount ?? 0,
          0
        );
        this.getInventary();
        this.formTable2
          .get('quantityToAssign')
          .setValue(Number(this.totalGoods));
      },
      error: () => {
        this.goodLoading = false;
      },
    });
  }

  getInventary() {
    this.loading2 = true;
    let params3: any = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    console.log(this.requestId);
    params3['sortBy'] = 'goodNumber:DESC';
    params3['proposalKey'] = localStorage.getItem('cvePropose');
    this.donationService.getInventory(params3).subscribe({
      next: data => {
        this.loading2 = false;
        this.goodLoading = false;
        this.inventaryAll = data.data;
        console.log(this.inventaryAll);
        this.totalItemsIn = data.count;
        this.dataFactInventary.load(this.inventaryAll);
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
    if (this.proposalId == null) {
      this.alertInfo(
        'warning',
        'No se puede crear una nueva solicitud sin selecccionar la propuesta',
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
        localStorage.setItem('cvePropose', next.proposalCve);

        //   this.requestModel = {
        //     solQuantity: next.solQuantity,
        //     requestId: next.requestId.id,
        //     requestDate: this.fromF = this.datePipe.transform(
        //       this.form.controls['from'].value,
        //       'dd/MM/yyyy'
        //     ),
        //     clasifGood: this.request.classifNumbGood,
        //     justification: this.request.justification,
        //     sunStatus: this.request.totalSunQuantity,
        //     proposalCve: thi
        // requestTypeId: string;
        //   }
      }
    });
  }

  selectedGooodsValid: any[] = [];
  goodsValid: any;

  async addSelect() {
    if (this.proposeDefault == null) {
      this.alert(
        'warning',
        'No existe una propuesta en la cual asignar el bien.',
        'Debe capturar una propuesta y solicitud'
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
                _good => _good.id == good.goodId
              );

              this.Exportdate = true;
              console.log('indexGood', indexGood);
              if (indexGood != -1)
                this.dataTableGood_[indexGood].di_disponible = 'N';
              let obj = {
                pActaNumber: this.requestId,
                pStatusActa: 'SD',
                pVcScreen: 'FDONSOLAUTORIZA',
                pUser: this.authService.decodeToken().preferred_username,
              };
              await this.updateGoodEInsertHistoric(obj);
              await this.updateBienDetalle(good.goodId, 'ADA');
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
          // await this.getRequest(Number(localStorage.getItem('proposal')));
        });
      }
    }
  }
  async createDET(good: IInventaryRequest) {
    let obj: any = {
      proposalKey: this.proposalCve,
      goodNumber: good.goodNumber,
      goodEntity: null,
    };
    console.log(obj);
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
          this.alert(
            'warning',
            'El Bien ya se encuentra registrado en el inventario',
            ''
          );
          resolve(false);
        },
      });
    });
  }
  async updateBienDetalle(idGood: number, status: string) {
    this.goodService.putStatusGood(idGood, status).subscribe({
      next: data => {
        console.log(data);
        this.getRequestGood();
      },
      error: () => (this.loading = false),
    });
  }

  removeSelect() {
    if (this.proposeDefault == null) {
      this.alert(
        'warning',
        'Debe especificar/buscar la propuesta para luego eliminar el bien.',
        ''
      );
      return;
    } else if (this.selectedGooods.length == 0) {
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
        '¿Seguro que desea eliminar el bien del Inventario?',
        ''
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          if (this.selectedGooods.length > 0) {
            // this.goods = this.goods.concat(this.selectedGooodsValid);
            let result = this.selectedGooods.map(async good => {
              console.log('good', good);
              this.goods = this.goods.filter(
                (_good: any) => _good.id != good.id
              );
              let index = this.dataTableGood_.findIndex(g => g.id === good.id);
              await this.updateBienDetalle(good.id, 'DON');

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
              await this.getHistory(good);

              await this.deleteDET(good);
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
      this.selectedGooods = row.isSelected;
      this.changeDetectorRef.detectChanges();
      this.form.get('classifNumbGood').setValue(row.good.noClasifGood);
      this.form.get('descripClassif').setValue(row.good.clasificationGood);
      this.inventaryModel = {
        proposalKey: this.request.proposalCve ?? '',
        goodNumber: this.selectedRow.goodId,
        goodEntity: this.selectedRow.goodId,
      };
      this.deleteInv = {
        proposalKey: this.request.proposalCve ?? '',
        goodNumber: this.selectedRow.goodId,
      };
      // this.form.patchValue({
      //   proposal: this.request.proposalCve,
      //   classifNumbGood: this.selectedRow.good.noClasifGood,
      //   descripClassif: this.selectedRow.good.clasificationGood,
      // });
    } else {
      this.selectedRow = null;
    }
  }
  requestSelected(row: any): void {
    if (row.isSelected) {
      this.requestModel = row.data;
      console.log(this.requestModel.proposalCve);
      console.log(this.requestModel);
    } else {
      this.requestModel = null;
    }
  }
  selectInventory(row: any): void {
    if (row.isSelected) {
      this.inventaryModel = row.data;
      console.log(this.inventaryModel.proposalKey);
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

  async deleteDET(good: IInventaryDelete) {
    console.log(good);
    const valid: any = await this.getGoodsDelete(this.inventaryModel);
    if (valid != null) {
      await this.deleteDetailProcee(this.inventaryModel);
    }
  }
  async getGoodsDelete(body: IInventaryDelete) {
    return new Promise((resolve, reject) => {
      this.donationService.deleteGoodReq(body).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async deleteDetailProcee(body: IInventaryRequest) {
    return new Promise((resolve, reject) => {
      this.donationService.deleteGoodReq(body).subscribe({
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
  async getHistory(good: any) {
    this.history = {
      propertyNum: good.id,
      status: 'ADA',
      changeDate: new Date(),
      userChange: this.authService.decodeToken().username,
      statusChangeProgram: 'AUTOMATICO',
      reasonForChange: 'Parcializado en Autorización Inventario SD',
      registryNum: null,
      extDomProcess: good.extDomProcess,
    };
    this.historyGoodService
      .createHistoricGoodsAsegExtdom(this.history)
      .subscribe({
        next: data => {
          console.log('insertado en historicos');
        },
      });
  }
  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      // debugger;
      this.data.load([]);
      this.totalItems = 0;
      this.selectedGooodsValid = [];
      this.idsNotExist = [];
      this.showError = false;

      // this.ids = this.excelService.getData(binaryExcel);
      if (this.ids[0].no_bien === undefined) {
        this.alert(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      } else {
        // this.loadGood(this.ids);
        this.fillData(this.ids);
        this.alert('success', 'Se ha cargado el archivo', '');
      }
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', '');
    }
  }

  private fillSelectedRows() {
    setTimeout(() => {
      // debugger;
      console.log(this.selectedGooods, this.table);
      const currentPage = this.params.getValue().page;
      const selectedPage = this.pageSelecteds.find(
        page => page === currentPage
      );
      this.table.isAllSelected = false;
      let allSelected = true;
      if (this.selectedGooods && this.selectedGooods.length > 0) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selectedGooods.find(item => row.getData()['id'] === item.id)
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 300);
  }
}

export interface IParamsAuth {
  origin: string;
  proposal: string;
}
