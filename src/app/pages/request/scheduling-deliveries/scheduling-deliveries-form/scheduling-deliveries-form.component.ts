import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGoodInvAvailableView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN2,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IprogrammingDelivery } from 'src/app/pages/siab-web/sami/receipt-generation-sami/receipt-table-goods/ireceipt';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { NotificationDestructionFormComponent } from '../notification-destruction-form/notification-destruction-form.component';
import { NotificationDestructionFoundFormComponent } from '../notification-destruction-found-form/notification-destruction-found-form.component';
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

  programmingDeliveryInfo: IprogrammingDelivery;
  typeUser: string = '';
  nameUser: string = '';
  clientName: string = '';
  idTypeEvent: number = 0;
  organizationCode: string = '';
  transferent: number = 0;
  goodsToProgramData = new LocalDataSource();
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
    private router: Router,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private notificationService: NotificationService,
    private regionalDelegationService: RegionalDelegationService
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
          this.programmingDelId = response.data[0].id;
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
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.showInfoProgrammingDelivery());
        },
        error: error => {
          console.log('no hay programación', error);
          const formData = {
            id: 16902,
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

        this.schedulingDeliverieForm.get('id').setValue(this.programmingDelId);

        const startDate = moment(
          this.schedulingDeliverieForm.get('startDate').value,
          'DD/MM/YYYY HH:mm:ssZ'
        ).toDate();
        const endDate = moment(
          this.schedulingDeliverieForm.get('endDate').value,
          'DD/MM/YYYY HH:mm:ssZ'
        ).toDate();

        console.log('startDate', startDate);
        console.log('endDate', endDate);

        const infoSave: IprogrammingDelivery = {
          id: this.schedulingDeliverieForm.get('id').value,
          typeEvent: typeEvent,
          startDate: startDate,
          store: store,
          endDate: endDate,
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
          .updateProgrammingDelivery(this.programmingDelId, infoSave)
          .subscribe({
            next: async response => {
              console.log('prog Del', response);
              const generateFolio = await this.generateFolioProgrammingDelivery(
                response
              );

              if (generateFolio) {
                this.disabledTypeEvent = true;
                this.disabledTransferent = true;
                this.disabledWarehouse = true;
                this.checkProgrammingDelivery();
                this.alert(
                  'success',
                  'Correcto',
                  'Programación entrega guardada correctamente'
                );
              }
            },
            error: error => {
              console.log('Error ap actualizar', error);
            },
          });
      }
    });
  }

  generateFolioProgrammingDelivery(programmingDelivery: IprogrammingDelivery) {
    return new Promise(async (resolve, reject) => {
      const showNameDelegation: any = await this.showDelegationName(
        programmingDelivery.delRegId
      );

      if (showNameDelegation) {
        const folioProgDel = `E-${showNameDelegation}-${this.programmingDelId}`;
        const infoProgramming: IprogrammingDelivery = {
          id: this.programmingDelId,
          folio: folioProgDel,
        };

        this.programmingRequestService
          .updateProgrammingDelivery(this.programmingDelId, infoProgramming)
          .subscribe({
            next: response => {
              console.log('response Actualizado', response);
              resolve(true);
            },
            error: error => {},
          });
      }
    });
  }

  showDelegationName(delegationId: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(delegationId).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {},
      });
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

  async addGoodsProgrammingDelivery() {
    if (this.goodDesSelect.length > 0) {
      const saveProgramming = await this.saveProgrammingDelivery();

      /*this.goodDesSelect.map(good => {
        const goodForm: IGoodDelivery = {
          programmingDeliveryId: this.programmingDelId,
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

        console.log(
          'Guardar en programación entrega bienes con id de reservación'
        );

        this.programmingRequestService
          .createGoodProgrammingDevilery(goodForm)
          .subscribe({
            next: async response => {
              console.log('response', response);

              this.checkProgrammingDelivery();
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.showInfoProgrammingDelivery());
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
      }); */
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un bien para agregar a la programación de entrega'
      );
    }
  }

  saveProgrammingDelivery() {
    const infoProg = {
      id: this.programmingDelId,
      typeEvent: this.schedulingDeliverieForm.get('typeEvent').value,
      startDate: moment(
        this.schedulingDeliverieForm.get('startDate').value
      ).format(),
      store: this.schedulingDeliverieForm.get('store').value,
      endDate: moment(
        this.schedulingDeliverieForm.get('endDate').value
      ).format(),
      transferId: this.schedulingDeliverieForm.get('transferId').value,
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
      status: this.schedulingDeliverieForm.get('status').value,
      statusAut: this.schedulingDeliverieForm.get('statusAut').value,
      statusInstance: this.schedulingDeliverieForm.get('statusInstance').value,
      statusInstanceNumber: this.schedulingDeliverieForm.get(
        'statusInstanceNumber'
      ).value,
      typeUser: this.schedulingDeliverieForm.get('typeUser').value,
    };

    console.log('this.schedulingDeliverieForm', infoProg);
    this.programmingRequestService
      .updateProgrammingDelivery(this.programmingDelId, infoProg)
      .subscribe({
        next: response => {
          console.log('response', response);
          //resolve(true);
        },
        error: error => {
          console.log('error de actualización', error);
          //resolve(false);
        },
      });
    /*return new Promise((resolve, reject) => {
      
    }); */
  }

  showInfoProgrammingDelivery() {
    this.params.getValue()['filter.programmingDeliveryId'] =
      this.programmingDelId;
    this.programmingRequestService
      .getGoodsProgrammingDelivery(this.params.getValue())
      .subscribe({
        next: response => {
          console.log('programming goodDelivery', response);
          this.goodsToProgramData.load(response.data);
          this.totalItems = response.count;
        },
        error: error => {},
      });
  }

  addEstate(event: Event) {}

  generateConDestruccion() {
    this.goodsToProgramData.getElements().then(data => {
      if (data.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea generar los reportes de destrucción?'
        ).then(question => {
          if (question.isConfirmed) {
            const formData = {
              id: this.programmingDelId,
              statusNotification: 'Y',
            };

            this.programmingRequestService
              .updateProgrammingDelivery(this.programmingDelId, formData)
              .subscribe({
                next: response => {
                  console.log('se actualizo la notificación de entrega');
                  this.alert(
                    'success',
                    'Correcto',
                    'Se crearon los reportes de destrucción correctamente'
                  );
                  this.checkProgrammingDelivery();
                },
                error: error => {
                  console.log('No fue posible actualizar la notificación');
                },
              });
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
              idprogDel: this.programmingDelId,
              callback: (next: boolean) => {
                if (next) {
                  this.showReportDestruction();
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
      params.getValue()['filter.programmingDeliveryId'] = this.programmingDelId;
      params.getValue()['filter.​typeNotification'] = 1;
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

  checkExistNotificationDestructionFond() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingDeliveryId'] = this.programmingDelId;
      params.getValue()['filter.typeNotification'] = '2';
      this.notificationService
        .getNotificationDestruction(params.getValue())
        .subscribe({
          next: response => {
            console.log('response', response);
            resolve(true);
          },
          error: error => {
            console.log('error', error);
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
      idprogDel: this.programmingDelId,
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
      idprogDel: this.programmingDelId,
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
              idprogDel: this.programmingDelId,
              callback: (next: boolean) => {
                if (next) {
                  this.showReportDestructionFond();
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
    } else {
      const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;
      this.alertQuestion(
        'question',
        'Confirmación',
        `¿Desea enviar la programación de entrega con folio ${this.programmingDeliveryInfo.folio}?`
      ).then(question => {
        if (question.isConfirmed) {
          console.log('enviar correo electronico');
          const formData = {
            idprogramming: this.programmingDelId,
            eventType: typeEvent,
          };
          this.programmingRequestService
            .sendEmailProgrammingDelivery(formData)
            .subscribe({
              next: response => {
                console.log('Correo enviado', response);
              },
              error: error => {
                console.log('Correo no enviado', error);
              },
            });
        }
      });
    }
  }
}
