import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { Grid } from 'ng2-smart-table/lib/lib/grid';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGoodInvAvailableView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN2,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { ShowDocumentsGoodComponent } from '../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { NotificationDestructionFormComponent } from '../notification-destruction-form/notification-destruction-form.component';
import { NotificationDestructionFoundFormComponent } from '../notification-destruction-found-form/notification-destruction-found-form.component';
import { IGoodDelivery } from './good-delivery.interface';
import {
  SCHEDULING_DELIVERIES_COLUMNS,
  SCHEDULING_DELIVERIES_SALES_COLUMNS,
  SEARCH_DESTRUCTION_TABLE,
  SEARCH_SALES_TABLE,
} from './scheduling-deliveries-columns';
import { IClient, TypeEvent } from './type-events';

@Component({
  selector: 'app-scheduling-deliveries-form',
  templateUrl: './scheduling-deliveries-form.component.html',
  styleUrls: ['./scheduling-deliveries.scss'],
})
export class SchedulingDeliveriesFormComponent
  extends BasePage
  implements OnInit {
  @Output() sourceChange = new EventEmitter<true>();
  schedulingDeliverieForm: FormGroup = new FormGroup({});
  showFileSaleForm: boolean = false;
  showDetailProgramming: boolean = false;
  showDetailProgrammingDes: boolean = true;
  filterDevolution: boolean = true;
  filterDestruction: boolean = true;
  filterPreviewGood: boolean = true;
  filterDonation: boolean = true;
  filterSales: boolean = true;
  loadingGoodsDest: boolean = false;
  saveLoading: boolean = false;
  isReadOnly: boolean = false;
  isReadOnlyDes: string = 'N';
  loadingGoodsDevolution: boolean = false;
  loadingGoodsDonation: boolean = false;
  loadingGoodsSales: boolean = false;
  disableStore: boolean = false;
  TypeEventOptions = new DefaultSelect(TypeEvent);
  warehouse = new DefaultSelect<IWarehouse>();
  transferences = new DefaultSelect<ITransferente>();
  clients = new DefaultSelect<IClient>();
  showSearchForm: boolean = true;
  searchForm: FormGroup = new FormGroup({});
  searchDestructionForm: FormGroup = new FormGroup({});
  searchDevolutionForm: FormGroup = new FormGroup({});
  searchDonationForm: FormGroup = new FormGroup({});
  searchSalesForm: FormGroup = new FormGroup({});
  goodsToProgram: any[] = [];
  SearchSalesData: any[] = [];
  goodDesSelect: IGoodInvAvailableView[] = [];
  disabledTypeEvent: boolean = false;
  disabledTransferent: boolean = false;
  disabledWarehouse: boolean = false;
  disabledStartDate: boolean = false;
  disabledEndDate = false;
  disableTransfer: boolean = false;
  infoGoodDestruction = new LocalDataSource();
  infoGoodDevolution = new LocalDataSource();
  infoGoodDonation = new LocalDataSource();
  infoGoodSales = new LocalDataSource();
  regionalDelegationNum: number = 0;
  nameEvent: string = '';

  save: boolean = false;

  programmingDeliveryInfo: IprogrammingDelivery;
  statusNotification = 'N';
  typeUser: string = '';
  nameUser: string = '';
  idClient: number;
  clientName: string = '';
  idTypeEvent: number = 0;
  typeEventname: string = '';
  organizationCode: string = '';
  organizationName: string = '';
  transferent: number = 0;
  transferentName: string = '';
  goodsToProgramData = new LocalDataSource();
  date = new Date();
  startDate = new Date();
  endDate = new Date();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchDevol = new BehaviorSubject<ListParams>(new ListParams());
  programmingId: number = 0;

  paramsSearchDonation = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchSales = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsSearchDest: number = 0;
  totalItemsSearchDevol: number = 0;
  totalItemsSearchDonation: number = 0;
  totalItemsSearchSales: number = 0;

  notification1exist: boolean = false;
  notification2exist: boolean = false;
  //programmingDelId: number = 0;
  settingsSearchSales = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_SALES_TABLE,
    actions: false,
  };

  settingsSearchDest = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_DESTRUCTION_TABLE,
    actions: false,
  };

  settingsSearchDevol = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_DESTRUCTION_TABLE,
    actions: false,
  };

  settingsSearchDonation = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_DESTRUCTION_TABLE,
    actions: false,
  };

  constructor(
    private fb: FormBuilder,
    private programmingRequestService: ProgrammingRequestService,
    private goodsQueryService: GoodsQueryService,
    private transferentService: TransferenteService,
    private goodsInvService: GoodsInvService,
    private router: Router,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private notificationService: NotificationService,
    private regionalDelegationService: RegionalDelegationService,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    super();

    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: SCHEDULING_DELIVERIES_COLUMNS,
    };
    this.date.setDate(this.date.getDate() + 5);
  }

  async getFolio() {
    const user: any = this.authService.decodeToken();
    this.generateFolioProgrammingDelivery(user.department);
  }

  ngOnInit(): void {
    this.programmingDeliveryInfo = null;
    this.getTransferentSelect(new ListParams());
    this.prepareForm();
    this.prepareSearchDesForm();
    this.prepareSearchDevolutionForm();
    this.prepareSearchDonationForm();
    this.prepareSearchSalesForm();
    this.getInfoUserLog();

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showInfoProgrammingDelivery());

    this.paramsSearchDest
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodsInventory(false));

    this.paramsSearchDevol
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodsInventory(false));

    this.paramsSearchSales
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodsInventory(false));

    this.paramsSearchDonation
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodsInventory(false));

  }
  getInfoUserLog() {
    this.programmingRequestService.getUserInfo().subscribe({
      next: async (response: any) => {
        this.regionalDelegationNum = response.department;
        this.typeUser = response.employeetype;
        this.nameUser = response.username;
        this.getWarehouseSelect(new ListParams());
        this.getClientSelect(new ListParams());
        // this.checkProgrammingDelivery();

        //if (getClientName)
      },
      error: error => { },
    });
  }

  getClientName() {
    return new Promise((resolve, reject) => {
      const formData = {
        psDelReg: this.regionalDelegationNum,
      };

      this.goodsInvService.getClientName(formData).subscribe({
        next: response => {
          //this.clientName = response.data[0].client;
          resolve(true);
        },
        error: () => { },
      });
    });
  }

  checkProgrammingDelivery() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.delRegId'] = this.regionalDelegationNum;
    params.getValue()['filter.cretationUser'] = this.nameUser;
    //params.getValue()['filter.client'] = this.clientName;

    this.programmingRequestService
      .getProgrammingDelivery(params.getValue())
      .subscribe({
        next: async response => {
          //this.programmingDelId = response.data[0].id;
          this.programmingDeliveryInfo = response.data[0];

          if (this.programmingDeliveryInfo?.startDate) {
            this.programmingDeliveryInfo.startDate = moment(
              this.programmingDeliveryInfo.startDate
            ).format('DD/MM/YYYY HH:mm:ss');
          }

          if (this.programmingDeliveryInfo?.endDate) {
            this.programmingDeliveryInfo.endDate = moment(
              this.programmingDeliveryInfo.endDate
            ).format('DD/MM/YYYY HH:mm:ss');
          }
          if (this.programmingDeliveryInfo.typeEvent)
            this.disabledTypeEvent = true;

          if (this.programmingDeliveryInfo.typeEvent == 5) {
            this.idTypeEvent = this.programmingDeliveryInfo?.typeEvent;
            this.programmingDeliveryInfo.typeEventInfo = 'DESTRUCCIÓN';
          }

          if (this.programmingDeliveryInfo.transferId) {
            this.disableTransfer = true;
            const transportableName = await this.transportableName(
              this.programmingDeliveryInfo.transferId
            );
            this.programmingDeliveryInfo.transferName = transportableName;
          }

          if (this.programmingDeliveryInfo.store) {
            this.disableStore = true;
            const showStoreName = await this.getNameWarehouse(
              this.programmingDeliveryInfo.store
            );
            this.programmingDeliveryInfo.storeName = showStoreName;
          }

          this.schedulingDeliverieForm.patchValue(this.programmingDeliveryInfo);
        },
        error: error => {
          const formData = {
            delRegId: this.regionalDelegationNum,
            cretationUser: this.nameUser,
            creationDate: new Date(),
            modificationUser: this.nameUser,
            modificationDate: new Date(),
          };

          this.programmingRequestService
            .createProgrammingDelivery(formData)
            .subscribe({
              next: (data: any) => {
                //this.programmingDelId = data.id;
              },
              error: error => { },
            });
        },
      });
    /* */
  }

  transportableName(transportable: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = transportable;
      this.transferentService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].nameTransferent);
        },
        error: error => { },
      });
      /*this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
        next: response => {
       
          resolve(response.data[0].name);
        },
        error: error => {},
      }); */
    });
  }

  getNameWarehouse(warehouse: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.organizationCode'] = warehouse;
      this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].name);
        },
        error: error => { },
      });
    });
  }

  prepareForm() {
    const tomorrow = addDays(new Date(), 1);
    this.schedulingDeliverieForm = this.fb.group({
      notificationId: [null],
      programmingDeliveryId: this.programmingDeliveryInfo?.id,
      typeNotification: [null],
      typeEvent: [null, [Validators.required]],
      typeEventInfo: [null,],
      startDate: [null, [Validators.required]],
      store: [null, [Validators.required]],
      storeName: [null],
      endDate: [null, [Validators.required]],
      transferId: [null, [Validators.required]],
      transferName: [null],
      client: [null],
      clientName: [null],
      postAddressee: [null],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN2),
          Validators.maxLength(255),
        ],
      ],
      officeDestructionNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      company: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      addressee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      placeDestruction: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      chargeAddressee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      locationDestruction: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      addressAddressee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      taxpayerName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      metodDestruction: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      legalRepresentativeName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      term: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      status: ['PROG_ENTREGA'],
      statusAut: ['SIN_BIENES'],
      statusInstance: ['SIN_INSTANCIA'],
      statusInstanceNumber: ['SIN_INSTANCIA'],
      typeUser: [null],
    });
  }

  prepareSearchDesForm() {
    this.searchDestructionForm = this.fb.group({
      quantity: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(50)],
      ],
      managementNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      descriptionGood: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      inventoryNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      bienSiabNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  prepareSearchDevolutionForm() {
    this.searchDevolutionForm = this.fb.group({
      quantity: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(100)],
      ],
      managementNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      descriptionGood: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      inventoryNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      bienSiabNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  prepareSearchDonationForm() {
    this.searchDonationForm = this.fb.group({
      quantity: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(100)],
      ],
      managementNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      descriptionGood: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      inventoryNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      bienSiabNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  prepareSearchSalesForm() {
    this.searchSalesForm = this.fb.group({
      descriptionGood: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      bienSiabNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      commercialEvent: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      managementNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      bill: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      inventoryNum: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      commercialLot: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
    });
  }

  getWarehouseSelect(params: ListParams) {
    params['filter.orderBy'] = `name:ASC`;
    params['filter.name'] = `$ilike:${params.text}`;
    params['filter.regionalDelegation'] = this.regionalDelegationNum;
    //params['filter.managedBy'] = 'Tercero';
    //params['filter.managedBy'] = 'SAE';
    this.goodsQueryService.getCatStoresView(params).subscribe({
      next: data => {
        this.warehouse = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.warehouse = new DefaultSelect();
      },
    });
  }

  selectEvent(event: Event) {
    const data = (event.target as HTMLInputElement).value;
    if (data == 'ventas') {
      this.showFileSaleForm = true;
      this.settings = {
        ...this.settings,
        actions: false,
        columns: SCHEDULING_DELIVERIES_SALES_COLUMNS,
      };
    } else if (data == 'donacion') {
      this.showFileSaleForm = false;
      this.filterSales = true;
      this.settings = {
        ...this.settings,
        actions: false,
        columns: SCHEDULING_DELIVERIES_COLUMNS,
      };
    }
  }

  getTransferentSelect(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferences = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.transferences = new DefaultSelect();
      },
    });
  }

  typeEventSelect(typeEvent: any, infoSelect: string) {
    console.log(typeEvent);
    if (infoSelect == 'typeEvent') {
      //this.disabledTypeEvent = true;
      this.idTypeEvent = typeEvent.id;
      this.typeEventname = typeEvent.nameEvent;
      //this.schedulingDeliverieForm.get('typeEventInfo').setValue(typeEvent.nameEvent);
    }

    if (infoSelect == 'transferent') {
      //this.disableTransfer = true;
      this.transferent = typeEvent.id;
      this.transferentName = typeEvent.nameAndId;
      //this.schedulingDeliverieForm.get('transferName').setValue(typeEvent.nameAndId);
    }

    if (infoSelect == 'organization') {
      //this.disableStore = true;
      this.organizationCode = typeEvent.organizationCode;
      this.organizationName = typeEvent.name;
      //this.schedulingDeliverieForm.get('storeName').setValue(typeEvent.name);
    }

    if (infoSelect == 'client') {
      //this.disableStore = true;
      this.idClient = typeEvent.id;
      this.clientName = typeEvent.client;
    }

    if (this.idTypeEvent && this.organizationCode && this.transferent) {
    }

    if (this.idTypeEvent && this.organizationCode) {
      //this.checkProgrammingDelivery();
    }
  }

  saveProgDelivery() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea guardar la programación de entrega?'
    ).then(question => {
      if (question.isConfirmed) {
        let typeEvent: any;
        let store: any;
        let transferent: any;

        const startDate = moment(
          this.schedulingDeliverieForm.get('startDate').value,
          'DD/MM/YYYY HH:mm:ssZ'
        ).toDate();
        const endDate = moment(
          this.schedulingDeliverieForm.get('endDate').value,
          'DD/MM/YYYY HH:mm:ssZ'
        ).toDate();
        const infoSave: IprogrammingDelivery = {
          id: this.programmingDeliveryInfo.id,
          typeEvent: typeEvent,
          startDate: startDate,
          store: store,
          endDate: endDate,
          transferId: transferent,
          client: this.clientName ? this.clientName : null,
          email: this.schedulingDeliverieForm.get('email').value,
          officeDestructionNumber: this.schedulingDeliverieForm.get(
            'officeDestructionNumber'
          ).value,
          company: this.schedulingDeliverieForm.get('company').value,
          addressee: this.schedulingDeliverieForm.get('addressee').value,
          placeDestruction:
            this.schedulingDeliverieForm.get('placeDestruction').value,
          chargeAddressee:
            this.schedulingDeliverieForm.get('chargeAddressee').value,
          locationDestruction: this.schedulingDeliverieForm.get(
            'locationDestruction'
          ).value,
          addressAddressee:
            this.schedulingDeliverieForm.get('addressAddressee').value,
          taxpayerName: this.schedulingDeliverieForm.get('taxpayerName').value,
          metodDestruction:
            this.schedulingDeliverieForm.get('metodDestruction').value,
          legalRepresentativeName: this.schedulingDeliverieForm.get(
            'legalRepresentativeName'
          ).value,
          term: this.schedulingDeliverieForm.get('term').value,
          typeUser: this.typeUser,
        };

        this.programmingRequestService
          .updateProgrammingDelivery(this.programmingDeliveryInfo.id, infoSave)
          .subscribe({
            next: async response => {
              this.getFolio();
              this.save = true;
              this.alert(
                'success',
                'Correcto',
                'Programación entrega guardada correctamente'
              );
            },
            error: () => { },
          });
      }
    });
  }

  generateFolioProgrammingDelivery(department) {
    console.log('department', department);
    return new Promise(async (resolve, reject) => {
      const showNameDelegation: any = await this.showDelegationName(department);

      if (showNameDelegation) {
        const folioProgDel = `E-${showNameDelegation}-${this.programmingDeliveryInfo.id}`;
        this.programmingDeliveryInfo.folio = folioProgDel;
        const infoProgramming: IprogrammingDelivery = {
          id: this.programmingDeliveryInfo.id,
          folio: folioProgDel,
        };

        this.programmingRequestService
          .updateProgrammingDelivery(
            this.programmingDeliveryInfo.id,
            infoProgramming
          )
          .subscribe({
            next: response => {
              console.log('response', response);
              resolve(true);
            },
            error: error => { },
          });
      }
    });
  }

  async showDelegationName(delegationId: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(delegationId).subscribe({
        next: response => {
          console.log('response', response);
          resolve(response.description);
        },
        error: error => { },
      });
    });
  }

  startDateSelect(date: any) {
    this.startDate = date;
  }

  endDateSelect(_endDate: any) {
    if (this.startDate < _endDate) {
      this.schedulingDeliverieForm
        .get('endDate')
        .addValidators([minDate(this.startDate)]);
      this.schedulingDeliverieForm
        .get('endDate')
        .setErrors({ minDate: { min: this.startDate } });
    }
  }

  showGoodsInventory(alert = true) {
    const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;
    const transferId = this.schedulingDeliverieForm.get('transferId').value;
    const store = this.schedulingDeliverieForm.get('store').value;
    const client = this.schedulingDeliverieForm.get('client').value;

    console.log('typeEvent', "showGoodsInventory");

    if (this.regionalDelegationNum && typeEvent && transferId && store) {

      this.showGoodInvDest(transferId, store);

    } else {
      if (alert) {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere seleccionar un almacén y una transferente'
        );
      }

    }
  }

  showGoodInvDest(transferent: number, store: string) {
    let params: any = {};

    if (this.idTypeEvent == 5) {
      this.nameEvent = 'DESTRUCCIÓN';
      params = this.paramsSearchDest.getValue();

      const managementNum =
        this.searchDestructionForm.get('managementNum').value;
      const quantity = this.searchDestructionForm.get('quantity').value;
      const descriptionGood =
        this.searchDestructionForm.get('descriptionGood').value;
      const inventoryNum = this.searchDestructionForm.get('inventoryNum').value;
      const bienSiabNum = this.searchDestructionForm.get('bienSiabNum').value;

      if (managementNum) {
        params['filter.managementNum'] = `$eq:${managementNum}`;
      }

      if (quantity) {
        params['filter.quantity'] = `$eq:${quantity}`;
      }

      if (descriptionGood) {
        params['filter.descriptionGood'] = `$ilike:${descriptionGood}`;
      }

      if (inventoryNum) {
        params['filter.inventoryNum'] = `$eq:${inventoryNum}`;
      }

      if (bienSiabNum) {
        params['filter.bienSiabNum'] = `$eq:${bienSiabNum}`;
      }

      //params['filter.orderBy'] = `$eq:descriptionGood:ASC`;

      params['filter.delRegSol'] = `$eq:${this.regionalDelegationNum}`;
      params['filter.inventoryKey'] = `$eq:${store}`;
      params['filter.entTransfereeId'] = `$eq:${transferent}`;
      params['filter.eventType'] = `$eq:A Destruir`;

      this.loadingGoodsDest = true;
    }

    if (this.idTypeEvent == 1) {
      this.nameEvent = 'VENTAS';
      params = this.paramsSearchSales.getValue();

      console.log('params ventas', params);

      const managementNum = this.searchSalesForm.get('managementNum').value;
      const descriptionGood = this.searchSalesForm.get('descriptionGood').value;
      const inventoryNum = this.searchSalesForm.get('inventoryNum').value;
      const bienSiabNum = this.searchSalesForm.get('bienSiabNum').value;
      const commercialEvent = this.searchSalesForm.get('commercialEvent').value;
      const bill = this.searchSalesForm.get('bill').value;
      const commercialLot = this.searchSalesForm.get('commercialLot').value;

      if (managementNum) {
        params['filter.managementNum'] = `$eq:${managementNum}`;
      }

      if (descriptionGood) {
        params['filter.descriptionGood'] = `$ilike:${descriptionGood}`;
      }

      if (inventoryNum) {
        params['filter.inventoryNum'] = `$eq:${inventoryNum}`;
      }

      if (bienSiabNum) {
        params['filter.bienSiabNum'] = `$eq:${bienSiabNum}`;
      }

      if (commercialEvent) {
        params['filter.commercialEvent'] = `$eq:${commercialEvent}`;
      }

      if (bill) {
        params['filter.bill'] = `$eq:${bill}`;
      }

      if (commercialLot) {
        params['filter.commercialLot'] = `$eq:${commercialLot}`;
      }

      // params['filter.orderBy'] = `descriptionGood:ASC`;

      params['filter.delRegSol'] = `$eq:${this.regionalDelegationNum}`;
      params['filter.inventoryKey'] = `$eq:${store}`;
      params['filter.entTransfereeId'] = `$eq:${transferent}`;
      params['filter.client'] = `$eq:${this.clientName}`;
      params['filter.eventType'] = `$eq:Vendidos`;

      this.loadingGoodsSales = true;
    }

    if (this.idTypeEvent == 4) {
      this.nameEvent = 'DEVOLUCIÓN';
      params = this.paramsSearchDevol.getValue();
      const managementNum =
        this.searchDevolutionForm.get('managementNum').value;
      const quantity = this.searchDevolutionForm.get('quantity').value;
      const descriptionGood =
        this.searchDevolutionForm.get('descriptionGood').value;
      const inventoryNum = this.searchDevolutionForm.get('inventoryNum').value;
      const bienSiabNum = this.searchDevolutionForm.get('bienSiabNum').value;

      if (managementNum) {
        params['filter.managementNum'] = `$eq:${managementNum}`;
      }

      if (quantity) {
        params['filter.quantity'] = `$eq:${quantity}`;
      }

      if (descriptionGood) {
        params['filter.descriptionGood'] = `$eq:${descriptionGood}`;
      }

      if (inventoryNum) {
        params['filter.inventoryNum'] = `$eq:${inventoryNum}`;
      }

      if (bienSiabNum) {
        params['filter.bienSiabNum'] = `$eq:${bienSiabNum}`;
      }

      params['filter.orderBy'] = `descriptionGood:ASC`;

      params['filter.delRegSol'] = `$eq:${this.regionalDelegationNum}`;
      params['filter.inventoryKey'] = `$eq:${store}`;
      params['filter.entTransfereeId'] = `$eq:${transferent}`;
      params['filter.eventType'] = `$eq:Devolución`;

      this.loadingGoodsDevolution = true;
    }

    if (this.idTypeEvent == 2) {
      this.nameEvent = 'DONACIÓN';
      params = this.paramsSearchDonation.getValue();
      const managementNum = this.searchDonationForm.get('managementNum').value;
      const quantity = this.searchDonationForm.get('quantity').value;
      const descriptionGood =
        this.searchDonationForm.get('descriptionGood').value;
      const inventoryNum = this.searchDonationForm.get('inventoryNum').value;
      const bienSiabNum = this.searchDonationForm.get('bienSiabNum').value;

      if (managementNum) {
        params['filter.managementNum'] = `$eq:${managementNum}`;
      }

      if (quantity) {
        params['filter.quantity'] = `$eq:${quantity}`;
      }

      if (descriptionGood) {
        params['filter.descriptionGood'] = `$eq:${descriptionGood}`;
      }

      if (inventoryNum) {
        params['filter.inventoryNum'] = `$eq:${inventoryNum}`;
      }

      if (bienSiabNum) {
        params['filter.bienSiabNum'] = `$eq:${bienSiabNum}`;
      }

      params['filter.orderBy'] = `descriptionGood:ASC`;

      params['filter.delRegSol'] = `$eq:${this.regionalDelegationNum}`;
      params['filter.inventoryKey'] = `$eq:${store}`;
      params['filter.entTransfereeId'] = `$eq:${transferent}`;
      params['filter.eventType'] = `$eq:Donados`;

      this.loadingGoodsDonation = true;
    }

    this.goodsInvService.getAllGoodInvParams(params).subscribe({
      next: response => {
        switch (this.idTypeEvent) {
          case 5:
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
            break;
          case 1:
            this.infoGoodSales.load(response.data);
            this.totalItemsSearchSales = response.count;
            this.loadingGoodsSales = false;
            break;

          case 4:
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
            break;

          case 2:
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
            break;
        }
      },
      error: error => {
        this.loadingGoodsDest = false;
        this.loadingGoodsDevolution = false;
        this.loadingGoodsDonation = false;
        this.loadingGoodsSales = false;
        this.alert(
          'warning',
          'Advertencia',
          'No hay bienes para ' + this.nameEvent + ' en el inventario'
        );
        this.totalItemsSearchDonation = 0;
        this.infoGoodDestruction.load([]);
        this.infoGoodDevolution.load([]);
        this.infoGoodDonation.load([]);
        this.infoGoodSales.load([]);
      },
    });
    this.cleanSearchForm();
  }

  /*getInventaryGoods() {
    const store = this.schedulingDeliverieForm.get('store').value;
    const transferId = this.schedulingDeliverieForm.get('transferId').value;
    const formData = {
      delRegSol: this.regionalDelegationNum,
      inventoryKey: store,
      entTransfereeId: transferId,
    };

    this.goodsInvService
      .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
      .subscribe({
        next: response => {
         
          this.infoGoodDestruction.load(response.data);
          this.totalItemsSearchDest = response.count;
        },
        error: error => {},
      });
  } */

  getClientSelect(params: ListParams) {
    params['sortBy'] = `client:ASC`;
    const formData = {
      psDelReg: this.regionalDelegationNum,
    };

    this.goodsInvService.getClients(params, formData).subscribe({
      next: response => {
        //this.clientName = response.data[0].client;

        this.clients = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.clients = new DefaultSelect();
      },
    });
  }

  cleanSearchForm() {

    this.totalItemsSearchDest = 0;
    this.totalItemsSearchDevol = 0;
    this.totalItemsSearchDonation = 0;
    this.totalItemsSearchSales = 0

    this.searchDestructionForm.reset();
    this.searchDevolutionForm.reset();
    this.searchDonationForm.reset();
    this.searchSalesForm.reset();

    this.paramsSearchDest;

    this.infoGoodDestruction.load([]);
    this.infoGoodDevolution.load([]);
    this.infoGoodDonation.load([]);
    this.infoGoodSales.load([]);

    //this.params = new BehaviorSubject<ListParams>(new ListParams());
    //this.paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
    //this.paramsSearchDevol = new BehaviorSubject<ListParams>(new ListParams());
    //this.paramsSearchDonation = new BehaviorSubject<ListParams>(new ListParams());
    //this.paramsSearchSales = new BehaviorSubject<ListParams>(new ListParams());
  }

  goodsSelectDest(goodInvSelect: IGoodInvAvailableView[]) {
    this.goodDesSelect = goodInvSelect;
  }

  addedGoods: IGoodDelivery[] = [];

  async addGoodsProgrammingDelivery() {
    if (this.goodDesSelect.length > 0) {
      if (!this.schedulingDeliverieForm.valid) {
        this.alert(
          'warning',
          'Advertencia',
          'Favor de llenar todos los campos requeridos'
        );
      } else {
        const saveProgramming = await this.saveProgrammingDelivery();

        let alreadyAddedGoods = this.goodDesSelect.filter(good =>
          this.addedGoods.find(
            addedGood => addedGood.goodId === good.managementNum
          )
        );

        if (alreadyAddedGoods.length > 0) {
          let alreadyAddedGoodsNames = alreadyAddedGoods
            .map(good => good.managementNum)
            .join(', ');
          this.alert(
            'warning',
            'Acción Invalida',
            `Los siguientes bienes ya han sido agregados a la programación de entrega: ${alreadyAddedGoodsNames}`
          );
        } else {

          this.goodDesSelect.map(good => {
            const goodForm: IGoodDelivery = {
              programmingDeliveryId: saveProgramming['id'],
              goodId: good?.managementNum,
              client: good?.client,
              delReg: good?.delRegSol,
              descriptionGood: good?.descriptionGood,
              amountGood: good?.quantity,
              compensationOpinion: good?.dictumCompensation,
              commercialEvent: good?.commercialEvent,
              invoice: good?.bill,
              item: good?.item,
              commercialLot: good?.commercialLot,
              inventoryNumber: good?.inventoryNum,
              resolutionSat: good?.satResolution,
              unit: good?.uomCode,
              typeProgrammingId: good?.type,
              transactionId: good?.transactionId,
              siabGoodNumber: good?.bienSiabNum,
              origen: good?.origin,
              commercialEventDate: good?.commercialEventDate,
              tranferId: good?.organizationId,
              typeRelevantId: good?.relevant_type,
              locatorId: good?.locatorId,
              inventoryItemId: good?.inventoryItemId,
              foundInd: 'N',
            };

            this.programmingRequestService
              .createGoodProgrammingDevilery(goodForm)
              .subscribe({
                next: async response => {
                  this.addedGoods.push(goodForm);
                  this.showInfoProgrammingDelivery();
                },
                error: error => { },
              });
          });
          this.alert(
            'success',
            'Acción Exitosa',
            'Bienes agregados correctamente'
          );
          this.deselectAll();
        }
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien para agregar a la programación de entrega'
      );
    }
  }

  selectedRows: any[] = [];

  goodsSelect(goodSelect: IGoodInvAvailableView[]) {
    this.selectedRows = goodSelect;
    console.log(this.selectedRows);
  }
  async deleteGoodProgrammingDelivery() {
    if (this.selectedRows.length > 0) {
      if (this.selectedRows.length != this.totalItems) {
        this.selectedRows.forEach(row => {
          this.programmingRequestService
            .deleteGoodProgrammingDevilery(row.id)
            .subscribe({
              next: async response => {
                this.addedGoods = this.addedGoods.filter(
                  good => good.goodId !== row.goodId
                );
              },
              error: error => { },
            });
        });
        this.alert(
          'success',
          'Acción Exitosa',
          `Se eliminaron correctamente los bienes seleccionados`
        );
        this.showInfoProgrammingDelivery();
        this.deselectAll();
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere al menos un bien para programación de entrega'
        );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien para eliminar de la programación de entrega'
      );
    }
  }

  async saveProgrammingDelivery() {
    const infoProg = {
      folio: null,
      statusNotification: 'Y',
      typeEvent: this.schedulingDeliverieForm.get('typeEvent').value,
      startDate: moment(
        this.schedulingDeliverieForm.get('startDate').value
      ).format(),
      store: this.schedulingDeliverieForm.get('store').value,
      endDate: moment(
        this.schedulingDeliverieForm.get('endDate').value
      ).format(),
      transferId: this.schedulingDeliverieForm.get('transferId').value,
      client: this.clientName ? this.clientName : null,
      email: this.schedulingDeliverieForm.get('email').value,
      officeDestructionNumber: this.schedulingDeliverieForm.get(
        'officeDestructionNumber'
      ).value,
      company: this.schedulingDeliverieForm.get('company').value,
      addressee: this.schedulingDeliverieForm.get('addressee').value,
      placeDestruction:
        this.schedulingDeliverieForm.get('placeDestruction').value,
      chargeAddressee:
        this.schedulingDeliverieForm.get('chargeAddressee').value,
      locationDestruction: this.schedulingDeliverieForm.get(
        'locationDestruction'
      ).value,
      addressAddressee:
        this.schedulingDeliverieForm.get('addressAddressee').value,
      taxpayerName: this.schedulingDeliverieForm.get('taxpayerName').value,
      metodDestruction:
        this.schedulingDeliverieForm.get('metodDestruction').value,
      legalRepresentativeName: this.schedulingDeliverieForm.get(
        'legalRepresentativeName'
      ).value,
      term: this.schedulingDeliverieForm.get('term').value,
      status: this.schedulingDeliverieForm.get('status').value,
      statusAut: this.schedulingDeliverieForm.get('statusAut').value,
      statusInstance: this.schedulingDeliverieForm.get('statusInstance').value,
      statusInstanceNumber: this.schedulingDeliverieForm.get(
        'statusInstanceNumber'
      ).value,
      typeUser: this.schedulingDeliverieForm.get('typeUser').value,
      delRegId: this.regionalDelegationNum,
    };

    return new Promise((resolve, reject) => {
      if (!isNullOrEmpty(this.programmingDeliveryInfo)) {
        infoProg['id'] = this.programmingDeliveryInfo.id;
        this.programmingRequestService
          .updateProgrammingDelivery(this.programmingDeliveryInfo.id, infoProg)
          .subscribe({
            next: response => {
              console.log(response);
              this.programmingDeliveryInfo = response;
              resolve(response);
            },
            error: error => {
              resolve(false);
            },
          });
      } else {
        this.programmingRequestService
          .createProgrammingDelivery(infoProg)
          .subscribe({
            next: response => {
              this.programmingDeliveryInfo = response;
              resolve(response);
              this.blockDetail();
            },
            error: error => {
              resolve(false);
            },
          });
      }
    });
  }

  blockDetail() {
    this.isReadOnly = true;
    this.schedulingDeliverieForm
      .get('storeName')
      .setValue(this.organizationName);
    this.schedulingDeliverieForm
      .get('transferName')
      .setValue(this.transferentName);
    this.schedulingDeliverieForm
      .get('typeEventInfo')
      .setValue(this.typeEventname);
    this.schedulingDeliverieForm
      .get('clientName')
      .setValue(this.clientName);

  }

  showInfoProgrammingDelivery() {
    this.params.getValue()['filter.programmingDeliveryId'] =
      this.programmingDeliveryInfo.id;
    this.programmingRequestService
      .getGoodsProgrammingDelivery(this.params.getValue())
      .subscribe({
        next: response => {
          this.goodsToProgramData.load(response.data);
          this.totalItems = response.count;
          console.log(this.goodsToProgramData);
        },
        error: error => {
          if ((error.statusCode = 400)) {
            this.goodsToProgramData.empty();
            this.totalItems = 0;
            console.log(this.goodsToProgramData);
          }
        },
      });
  }

  addEstate(event: Event) { }

  generateConDestruccion() {
    this.goodsToProgramData.getElements().then(data => {
      if (data.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea generar los reportes de destrucción?'
        ).then(question => {
          if (question.isConfirmed) {
            /*const formData = {
              id: this.programmingDeliveryInfo.id,
              statusNotification: 'Y',
            };*/
            //this.statusNotification = 'Y'
            this.saveProgrammingDelivery();
            /* this.programmingRequestService
              .updateProgrammingDelivery(
                this.programmingDeliveryInfo.id,
                formData
              )
              .subscribe({
                next: response => {
                  this.programmingDeliveryInfo = response;
                  this.alert(
                    'success',
                    'Correcto',
                    'Se crearon los reportes de destrucción correctamente'
                  );
                  this.isReadOnlyDes = 'Y';
                },
                error: error => {},
              });*/

            this.isReadOnlyDes = 'Y';
            this.createNotifyDestruccion(1);
            this.createNotifyDestruccion(2);
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere agregar bienes a la programación de entrega'
        );
      }
    });
  }

  createNotifyDestruccion(typeNotification) {
    this.schedulingDeliverieForm
      .get('programmingDeliveryId')
      .setValue(this.programmingDeliveryInfo.id);

    this.schedulingDeliverieForm
      .get('typeNotification')
      .setValue(typeNotification);

    this.notificationService
      .createNotificationDestruction(this.schedulingDeliverieForm.value)
      .subscribe({
        next: response => { },
        error: error => {
          console.log('error', error);
        },
      });
  }

  notificationDestruccion() {
    this.goodsToProgramData.getElements().then(async data => {
      if (data.length > 0) {
        if (this.programmingDeliveryInfo.statusNotification == 'Y') {
          const checkExistNotification =
            await this.checkExistNotificationDestruction();
          if (checkExistNotification) {
            this.showReportDestruction();
          } else {
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-xl modal-dialog-centered',
            };
            config.initialState = {
              idprogDel: this.programmingDeliveryInfo.id,
              callback: (next: boolean) => {
                if (next) {
                  this.showReportDestruction();
                  this.notification1exist = true;

                }
              },
            };

            this.modalService.show(
              NotificationDestructionFormComponent,
              config
            );
          }
        }
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere agregar bienes a la programación'
        );
      }
    });
  }

  checkExistNotificationDestruction() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      console.log(this.programmingDeliveryInfo.id);
      params.getValue()['filter.programmingDeliveryId'] =
        this.programmingDeliveryInfo.id;
      params.getValue()['filter.​typeNotification'] = 1;
      this.notificationService
        .getNotificationDestruction(params.getValue())
        .subscribe({
          next: response => {
            console.log(response);
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
    });
  }

  checkExistNotificationDestructionFond() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingDeliveryId'] =
        this.programmingDeliveryInfo.id;
      params.getValue()['filter.typeNotification'] = '2';
      this.notificationService
        .getNotificationDestruction(params.getValue())
        .subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
    });
  }

  showReportDestruction() {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    };
    config.initialState = {
      idprogDel: this.programmingDeliveryInfo.id,
      typeNotification: 1,
      callback: (next: boolean) => {
        if (next) {
          //this.showReportDestruction();
        }
      },
    };

    this.modalService.show(ShowReportComponentComponent, config);
  }

  showReportDestructionFond() {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    };
    config.initialState = {
      idprogDel: this.programmingDeliveryInfo.id,
      typeNotification: 2,
      callback: (next: boolean) => {
        if (next) {
          //this.showReportDestruction();
        }
      },
    };

    this.modalService.show(ShowReportComponentComponent, config);
  }

  notificationDestruccionFond() {
    this.goodsToProgramData.getElements().then(async data => {
      if (data.length > 0) {
        if (this.programmingDeliveryInfo.statusNotification == 'Y') {
          const checkExistNotification =
            await this.checkExistNotificationDestructionFond();
          if (checkExistNotification) {
            this.showReportDestructionFond();
          } else {
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-xl modal-dialog-centered',
            };
            config.initialState = {
              idprogDel: this.programmingDeliveryInfo.id,
              callback: (next: boolean) => {
                if (next) {
                  this.showReportDestructionFond();
                  this.notification2exist = true;
                }
              },
            };

            this.modalService.show(
              NotificationDestructionFoundFormComponent,
              config
            );
          }
        }
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se requiere agregar bienes a la programación'
        );
      }
    });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }

  sendProgramming() {
    const startDate = this.schedulingDeliverieForm.get('startDate').value;
    const endDate = this.schedulingDeliverieForm.get('endDate').value;
    const email = this.schedulingDeliverieForm.get('email').value;

    if (!startDate && !endDate) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere una fecha de inicio y fin para la programación'
      );
    } else if (email == null) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se debe ingresar un correo electrónico'
      );
    } else if (this.idTypeEvent > 0) {
      const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;

      const formData = {
        idprogramming: this.programmingDeliveryInfo.id,
        eventType: typeEvent,
      };
      this.programmingRequestService
        .sendEmailProgrammingDelivery(formData)
        .subscribe({
          next: () => { },
          error: () => { },
        });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se debe Seleccionar un tipo de evento '
      );
    }
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Turnar Solicitud',
      `¿Desea turnar la solicitud a la siguiente etapa con folio ${this.programmingDeliveryInfo.folio}?`
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.programmingDeliveryInfo) {
          const infoProgramming: IprogrammingDelivery = {
            id: this.programmingDeliveryInfo.id,
            status: 'EJECUTAR_ENTREGA',
          };

          this.programmingRequestService
            .updateProgrammingDelivery(
              this.programmingDeliveryInfo.id,
              infoProgramming
            )
            .subscribe({
              next: response => {
                console.log('response', response);
              },
              error: error => { },
            });
          this.loading = true;
          this.programmingId = this.programmingDeliveryInfo.id;
          //this.requestForm.get('creationUser').setValue(this.nameUser);
          const user: any = this.authService.decodeToken();

          let body: any = {};

          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Programar_Recepcion';
          body['ssubtype'] = 'TURNAR';

          let task: any = {};
          task['id'] = 0;
          task['assignees'] = user.username;
          task['assigneesDisplayname'] = this.nameUser;
          task['creator'] = user.username;
          task['reviewers'] = user.username;
          task['taskNumber'] = Number(this.programmingId);
          switch (this.idTypeEvent) {
            case 1:
              task['title'] =
                'Ejecutar entrega (Ventas) para la programación ' +
                this.programmingDeliveryInfo.folio;
              break;
            case 2:
              task['title'] =
                'Ejecutar entrega (Donación) para la programación ' +
                this.programmingDeliveryInfo.folio;
              break;
            case 3:
              task['title'] =
                'Ejecutar entrega (Resarcimiento) para la programación ' +
                this.programmingDeliveryInfo.folio;
              break;
            case 4:
              task['title'] =
                'Ejecutar entrega (Devolución) para la programación ' +
                this.programmingDeliveryInfo.folio;
              break;
            case 5:
              task['title'] =
                'Ejecutar entrega (Destrucción) para la programación ' +
                this.programmingDeliveryInfo.folio;
              break;
          }

          task['programmingId'] = this.programmingId;
          task['requestId'] = this.programmingId;
          task['expedientId'] = 0;
          task['idDelegationRegional'] = this.regionalDelegationNum;
          task['urlNb'] =
            'pages/request/scheduling-deliveries/execute-schelude-delivery';
          task['processName'] = 'SolicitudProgramacion';
          body['task'] = task;
          const taskResult = await this.createTaskOrderService(body);
          this.loading = false;
          if (taskResult) {
            this.sendProgramming();
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
            this.alert(
              'success',
              'Creación de Tarea Correcta',
              `Se creó la tarea Realizar Programación con el folio: ${this.programmingId}`
            );
          }
        }
      }
    });
  }

  showDocuments(): void {
    if (this.selectedRows.length == 0 || this.selectedRows.length >= 2) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se debe seleccionar un bien '
      );
    } else {
      const idGood = this.selectedRows[0].id;
      const idRequest = 0;
      let config: ModalOptions = {
        initialState: {
          idGood,
          idRequest,
          parameter: '',
          typeDoc: 'expedient',
          callback: (next: boolean) => {
            //if(next) this.getExample();
          },
        },
        class: `modalSizeXL modal-dialog-centered`,
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowDocumentsGoodComponent, config);
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(false);
        },
      });
    });
  }

  deselectAll() {
    this._tables.forEach(table => {
      const grid: Grid = table.grid;
      grid.getSelectedRows().forEach(row => {
        row.isSelected = false;
      });
      table.isAllSelected = false;
    });
  }
  numericOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
