import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGoodInvAvailableView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  implements OnInit
{
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
  isReadOnly: boolean = true;
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
  idProgrammingDelivery: number = 0;
  programmingDeliveryInfo: IprogrammingDelivery;
  typeUser: string = '';
  nameUser: string = '';
  clientName: string = '';
  idTypeEvent: number = 0;
  organizationCode: string = '';
  transferent: number = 0;
  goodsToProgramData: any[] = [];
  date = new Date();
  startDate = new Date();
  endDate = new Date();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchDevol = new BehaviorSubject<ListParams>(new ListParams());

  paramsSearchDonation = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchSales = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsSearchDest: number = 0;
  totalItemsSearchDevol: number = 0;
  totalItemsSearchDonation: number = 0;
  totalItemsSearchSales: number = 0;
  programmingDelId: number = 0;
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
    private router: Router
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: SCHEDULING_DELIVERIES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getTransferentSelect(new ListParams());
    this.prepareForm();
    this.prepareSearchDesForm();
    this.prepareSearchDevolutionForm();
    this.prepareSearchDonationForm();
    this.prepareSearchSalesForm();
    this.getInfoUserLog();
  }

  getInfoUserLog() {
    this.programmingRequestService.getUserInfo().subscribe({
      next: async (response: any) => {
        console.log('response', response);
        this.regionalDelegationNum = response.department;
        this.typeUser = response.employeetype;
        this.nameUser = response.username;
        this.getWarehouseSelect(new ListParams());
        this.getClientSelect(new ListParams());
        this.checkProgrammingDelivery();
        const getClientName = await this.getClientName();

        //if (getClientName)
      },
      error: error => {},
    });
  }

  getClientName() {
    return new Promise((resolve, reject) => {
      const formData = {
        psDelReg: this.regionalDelegationNum,
      };

      this.goodsInvService.getClientName(formData).subscribe({
        next: response => {
          this.clientName = response.data[0].client;
          resolve(true);
        },
        error: () => {},
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
          console.log('Programación entrega', response);
          this.idProgrammingDelivery = response.data[0].id;
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

          console.log('info', this.programmingDeliveryInfo);
          this.schedulingDeliverieForm.patchValue(this.programmingDeliveryInfo);
        },
        error: error => {},
      });
    /*const formData = {
      id: 16901,
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
          console.log('programación entrega creada', data);
          this.programmingDelId = data.id;
        },
        error: error => {},
      }); */
  }

  transportableName(transportable: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = transportable;
      this.transferentService.getAll(params.getValue()).subscribe({
        next: response => {
          console.log('response', response);
          resolve(response.data[0].nameTransferent);
        },
        error: error => {},
      });
      /*this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
        next: response => {
          console.log('alk', response);
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
          console.log('alk', response);
          resolve(response.data[0].name);
        },
        error: error => {},
      });
    });
  }

  prepareForm() {
    const tomorrow = addDays(new Date(), 1);
    this.schedulingDeliverieForm = this.fb.group({
      id: [null],
      typeEvent: [null],
      typeEventInfo: [null],
      startDate: [null, [Validators.required]],
      store: [null],
      storeName: [null],
      endDate: [null, [Validators.required]],
      transferId: [null],
      transferName: [null],
      client: [null],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
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
        console.log('data', data);
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
    if (infoSelect == 'typeEvent') {
      this.idTypeEvent = typeEvent.id;
    }

    if (infoSelect == 'transferent') {
      this.transferent = typeEvent.id;
    }

    if (infoSelect == 'organization') {
      this.organizationCode = typeEvent.organizationCode;
    }

    if (this.idTypeEvent && this.organizationCode && this.transferent) {
    }

    if (this.idTypeEvent && this.organizationCode) {
      this.checkProgrammingDelivery();
    }
  }

  saveProgDelivery() {
    let typeEvent: any;
    let store: any;
    let transferent: any;
    if (this.programmingDeliveryInfo?.typeEvent) {
      typeEvent = this.programmingDeliveryInfo?.typeEvent;
    } else {
      typeEvent = this.schedulingDeliverieForm.get('typeEvent');
    }

    if (this.programmingDeliveryInfo?.store) {
      store = this.programmingDeliveryInfo?.store;
    } else {
      store = this.schedulingDeliverieForm.get('store');
    }

    if (this.programmingDeliveryInfo?.transferId) {
      transferent = this.programmingDeliveryInfo?.transferId;
    } else {
      transferent = this.schedulingDeliverieForm.get('transferId');
    }

    this.schedulingDeliverieForm.get('id').setValue(this.idProgrammingDelivery);
    console.log(
      'startDate',
      new Date(this.schedulingDeliverieForm.get('startDate').value)
    );
    console.log(
      'endDate',
      new Date(this.schedulingDeliverieForm.get('endDate').value)
    );
    const infoSave: IprogrammingDelivery = {
      id: this.schedulingDeliverieForm.get('id').value,
      typeEvent: typeEvent,
      startDate: this.schedulingDeliverieForm.get('startDate').value,
      store: store,
      endDate: this.schedulingDeliverieForm.get('endDate').value,
      transferId: transferent,
      client: this.schedulingDeliverieForm.get('client').value,
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
      status: 'PROG_ENTREGA',
      statusAut: 'SIN_BIENES',
      statusInstance: 'SIN_INSTANCIA',
      statusInstanceNumber: 'SIN_INSTANCIA',
      typeUser: this.typeUser,
    };

    console.log('infoSave', infoSave);
    this.programmingRequestService
      .updateProgrammingDelivery(this.idProgrammingDelivery, infoSave)
      .subscribe({
        next: response => {
          console.log('prog Del', response);
          this.disabledTypeEvent = true;
          this.disabledTransferent = true;
          this.disabledWarehouse = true;
          this.checkProgrammingDelivery();
        },
        error: error => {
          console.log('Error ap actualizar', error);
        },
      });
  }

  startDateSelect(date: any) {
    this.startDate = date;
  }

  endDateSelect(_endDate: any) {
    console.log('this.startDate1', this.startDate);
    console.log('this.startDate2', this.programmingDeliveryInfo.startDate);
    if (this.startDate < _endDate) {
      this.schedulingDeliverieForm
        .get('endDate')
        .addValidators([minDate(this.startDate)]);
      this.schedulingDeliverieForm
        .get('endDate')
        .setErrors({ minDate: { min: this.startDate } });
    }
  }

  showGoodsInventory() {
    this.paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
    const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;
    const transferId = this.schedulingDeliverieForm.get('transferId').value;
    const store = this.schedulingDeliverieForm.get('store').value;
    const client = this.schedulingDeliverieForm.get('client').value;
    if (this.regionalDelegationNum && typeEvent && transferId && store) {
      if (typeEvent == 5) {
        this.paramsSearchDest = new BehaviorSubject<ListParams>(
          new ListParams()
        );
        this.paramsSearchDest
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showGoodInvDest(transferId, store));
      } else if (typeEvent == 4) {
        this.paramsSearchDevol = new BehaviorSubject<ListParams>(
          new ListParams()
        );
        this.paramsSearchDevol
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showGoodInvDev(transferId, store));
      } else if (typeEvent == 2) {
        this.paramsSearchDonation = new BehaviorSubject<ListParams>(
          new ListParams()
        );
        this.paramsSearchDonation
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showGoodInvDonation(transferId, store));
      } else if (typeEvent == 1) {
        this.paramsSearchSales = new BehaviorSubject<ListParams>(
          new ListParams()
        );
        this.paramsSearchSales
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showGoodInvSales(transferId, store, client));
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un almacén y una transferente'
      );
    }
  }

  showGoodInvDest(transferent: number, store: string) {
    const quantity = this.searchDestructionForm.get('quantity').value;
    const managementNum = this.searchDestructionForm.get('managementNum').value;
    const descriptionGood =
      this.searchDestructionForm.get('descriptionGood').value;
    const inventoryNum = this.searchDestructionForm.get('inventoryNum').value;
    const bienSiabNum = this.searchDestructionForm.get('bienSiabNum').value;

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        quantity: quantity,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        quantity: quantity,
        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;
      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',

        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDest = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDest = true;
      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'A Destruir',
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDest.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDestruction.load(response.data);
            this.totalItemsSearchDest = response.count;
            this.loadingGoodsDest = false;
          },
          error: error => {
            this.loadingGoodsDest = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para destrucción en el inventario'
            );
          },
        });
    }
  }

  showGoodInvDev(transferent: number, store: string) {
    const quantity = this.searchDevolutionForm.get('quantity').value;
    const managementNum = this.searchDevolutionForm.get('managementNum').value;
    const descriptionGood =
      this.searchDevolutionForm.get('descriptionGood').value;
    const inventoryNum = this.searchDevolutionForm.get('inventoryNum').value;
    const bienSiabNum = this.searchDevolutionForm.get('bienSiabNum').value;

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        quantity: quantity,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        quantity: quantity,
        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',

        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDevolution = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Devolución',
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDevolution.load(response.data);
            this.totalItemsSearchDevol = response.count;
            this.loadingGoodsDevolution = false;
          },
          error: error => {
            this.loadingGoodsDevolution = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Devolución en el inventario'
            );
          },
        });
    }
  }

  showGoodInvDonation(transferent: number, store: string) {
    const quantity = this.searchDonationForm.get('quantity').value;
    const managementNum = this.searchDonationForm.get('managementNum').value;
    const descriptionGood =
      this.searchDonationForm.get('descriptionGood').value;
    const inventoryNum = this.searchDonationForm.get('inventoryNum').value;
    const bienSiabNum = this.searchDonationForm.get('bienSiabNum').value;

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        quantity: quantity,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        quantity: quantity,
        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      quantity &&
      managementNum &&
      descriptionGood &&
      inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        quantity: quantity,
        managementNum: managementNum,
        descriptionGood: descriptionGood,
        inventoryNum: inventoryNum,
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        managementNum: managementNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      descriptionGood &&
      !inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        descriptionGood: descriptionGood,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      inventoryNum &&
      !bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        inventoryNum: inventoryNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }

    if (
      !quantity &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      bienSiabNum
    ) {
      this.loadingGoodsDonation = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Donados',
        bienSiabNum: bienSiabNum,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchDevol.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodDonation.load(response.data);
            this.totalItemsSearchDonation = response.count;
            this.loadingGoodsDonation = false;
          },
          error: error => {
            this.loadingGoodsDonation = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Donación en el inventario'
            );
          },
        });
    }
  }

  showGoodInvSales(transferent: number, store: string, client: string) {
    const descriptionGood = this.searchSalesForm.get('descriptionGood').value;
    const bienSiabNum = this.searchSalesForm.get('bienSiabNum').value;
    const commercialEvent = this.searchSalesForm.get('commercialEvent').value;
    const managementNum = this.searchSalesForm.get('managementNum').value;
    const bill = this.searchSalesForm.get('bill').value;
    const inventoryNum = this.searchSalesForm.get('inventoryNum').value;
    const commercialLot = this.searchSalesForm.get('commercialLot').value;

    if (
      !commercialEvent &&
      !managementNum &&
      !descriptionGood &&
      !inventoryNum &&
      !bienSiabNum &&
      !bill &&
      !commercialLot
    ) {
      this.loadingGoodsSales = true;

      const formData = {
        delRegSol: this.regionalDelegationNum,
        inventoryKey: store,
        entTransfereeId: transferent,
        eventType: 'Vendidos',
        client: client,
      };

      this.goodsInvService
        .getAllGoodInv(this.paramsSearchSales.getValue(), formData)
        .subscribe({
          next: response => {
            this.infoGoodSales.load(response.data);
            this.totalItemsSearchSales = response.count;
            this.loadingGoodsSales = false;
          },
          error: error => {
            this.loadingGoodsSales = false;
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para Venta en el inventario'
            );
          },
        });
    }
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
          console.log('response', response);
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
        this.clientName = response.data[0].client;

        this.clients = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.clients = new DefaultSelect();
      },
    });
  }

  cleanSearchForm() {
    const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;
    const store = this.schedulingDeliverieForm.get('store').value;
    const transferId = this.schedulingDeliverieForm.get('transferId').value;
    const client = this.schedulingDeliverieForm.get('client').value;
    if (typeEvent == 5) {
      this.searchDestructionForm.reset();
      this.paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsSearchDest
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showGoodInvDest(transferId, store));
    } else if (typeEvent == 4) {
      this.searchDevolutionForm.reset();
      this.paramsSearchDevol = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      this.paramsSearchDevol
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showGoodInvDev(transferId, store));
    } else if (typeEvent == 2) {
      this.searchDonationForm.reset();
      this.paramsSearchDonation = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      this.paramsSearchDonation
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showGoodInvDonation(transferId, store));
    } else if (typeEvent == 1) {
      this.searchSalesForm.reset();
      this.paramsSearchSales = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      this.paramsSearchSales
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showGoodInvSales(transferId, store, client));
    }
  }

  goodsSelectDest(goodInvSelect: IGoodInvAvailableView[]) {
    this.goodDesSelect = goodInvSelect;
    console.log('bienes seleccionados', this.goodDesSelect);
  }

  addGoodsProgrammingDelivery() {
    if (this.goodDesSelect.length > 0) {
      this.goodDesSelect.map(good => {
        const goodForm: IGoodDelivery = {
          programmingDeliveryId: this.programmingDelId,
          managementNum: good?.managementNum,
          client: good?.client,
          delRegSol: good?.delRegSol,
          descriptionGood: good?.descriptionGood,
          quantity: good?.quantity,
          dictumCompensation: good?.dictumCompensation,
          commercialEvent: good?.commercialEvent,
          bill: good?.bill,
          item: good?.item,
          commercialLot: good?.commercialLot,
          inventoryNum: good?.inventoryNum,
          satResolution: good?.satResolution,
          uomCode: good?.uomCode,
          type: good?.type,
          transactionId: good?.transactionId,
          bienSiabNum: good?.bienSiabNum,
          origin: good?.origin,
          commercialEventDate: good?.commercialEventDate,
          organizationId: good?.organizationId,
          relevant_type: good?.relevant_type,
          locatorId: good?.locatorId,
          inventoryItemId: good?.inventoryItemId,
        };

        console.log(
          'Guardar en programación entrega bienes con id de reservación'
        );

        this.programmingRequestService
          .createGoodProgrammingDevilery(goodForm)
          .subscribe({
            next: response => {
              console.log('response', response);
            },
            error: error => {
              console.log('error', error);
            },
          });
        console.log('datos a mandar a reservar en inventario');
        console.log('inventoryNum', good.inventoryNum);
        console.log('uomCode', good?.uomCode);
        console.log('organizationId', good?.organizationId);
        console.log('inventoryItemId', good?.inventoryItemId);
        console.log('origen referencia', 'ProgramacionEntrega/');
        console.log('cantidadReserva', good?.quantity);
        console.log('subInventoryCode', good?.eventType);
        console.log('locatorID', good?.locatorId);
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien para agregar a la programación de entrega'
      );
    }
  }

  addEstate(event: Event) {}

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
