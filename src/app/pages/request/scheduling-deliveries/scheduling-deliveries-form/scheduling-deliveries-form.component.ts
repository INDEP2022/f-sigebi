import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SCHEDULING_DELIVERIES_COLUMNS,
  SCHEDULING_DELIVERIES_SALES_COLUMNS,
  SEARCH_DESTRUCTION_TABLE,
  SEARCH_SALES_TABLE,
} from './scheduling-deliveries-columns';
import { TypeEvent } from './type-events';

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
  filterSales: boolean = false;
  TypeEventOptions = new DefaultSelect(TypeEvent);
  warehouse = new DefaultSelect<IWarehouse>();
  transferences = new DefaultSelect<ITransferente>();
  showSearchForm: boolean = true;
  searchForm: FormGroup = new FormGroup({});
  searchDestructionForm: FormGroup = new FormGroup({});
  goodsToProgram: any[] = [];
  SearchSalesData: any[] = [];
  infoGoodDestruction = new LocalDataSource();
  regionalDelegationNum: number = 0;
  typeUser: string = '';
  idTypeEvent: number = 0;
  goodsToProgramData: any[] = [];
  date = new Date();
  startDate = new Date();
  endDate = new Date();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearchDest = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsSearchDest: number = 0;
  settingsSearchSales = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_SALES_TABLE,
    edit: {
      editButtonContent: '<i class="fa fa-plus text-primary mx-2"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
    },
  };

  settingsSearchDest = {
    ...this.settings,
    selectMode: 'multi',
    columns: SEARCH_DESTRUCTION_TABLE,
    actions: false,
  };
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private programmingRequestService: ProgrammingRequestService,
    private goodsQueryService: GoodsQueryService,
    private transferentService: TransferenteService,
    private goodsInvService: GoodsInvService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: SCHEDULING_DELIVERIES_COLUMNS,
    };

    this.settingsSearchSales.actions.delete = true;
    this.SearchSalesData = [
      {
        item: '5645446',
        numberInventary: '3453453',
        numberGestion: '453453',
        goodDescription: 'Descripción',
        quantityEstates: '5435',
        unitOfMeasuremet: '45345',
        saeNumber: '34534534',
        commercialLot: 'test',
        commercialEvent: 'comercial',
        facture: 'factura',
      },
      {
        item: '45645645',
        numberInventary: '49768768',
        numberGestion: '1312221',
        goodDescription: 'Descripciónes',
        quantityEstates: '54354',
        unitOfMeasuremet: '453455',
        saeNumber: '56645',
        commercialLot: 'tests',
        commercialEvent: 'comercials',
        facture: 'facturas',
      },
    ];
  }

  ngOnInit(): void {
    this.getTransferentSelect(new ListParams());
    this.prepareForm();
    this.prepareSearchDesForm();
    this.prepareSearchForm();

    this.getInfoUserLog();
  }

  getInfoUserLog() {
    this.programmingRequestService.getUserInfo().subscribe({
      next: (response: any) => {
        this.regionalDelegationNum = response.department;
        this.typeUser = response.employeetype;
        this.getWarehouseSelect(new ListParams());
      },
      error: error => {},
    });
  }

  prepareForm() {
    const tomorrow = addDays(new Date(), 1);
    this.schedulingDeliverieForm = this.fb.group({
      typeEvent: [null],
      startDate: [null, [Validators.required]],
      store: [null],
      endDate: [null, [Validators.required]],
      transferId: [null],
      client: [null],
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      officeDestructionNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      company: [null, [Validators.pattern(STRING_PATTERN)]],
      addressee: [null, [Validators.pattern(STRING_PATTERN)]],
      placeDestruction: [null, [Validators.pattern(STRING_PATTERN)]],
      chargeAddressee: [null, [Validators.pattern(STRING_PATTERN)]],
      locationDestruction: [null, [Validators.pattern(STRING_PATTERN)]],
      addressAddressee: [null, [Validators.pattern(STRING_PATTERN)]],
      taxpayerName: [null, [Validators.pattern(STRING_PATTERN)]],
      metodDestruction: [null, [Validators.pattern(STRING_PATTERN)]],
      legalRepresentativeName: [null, [Validators.pattern(STRING_PATTERN)]],
      term: [null, [Validators.pattern(STRING_PATTERN)]],
      status: ['PROG_ENTREGA'],
      statusAut: ['SIN_BIENES'],
      statusInstance: ['SIN_INSTANCIA'],
      statusInstanceNumber: ['SIN_INSTANCIA'],
      typeUser: [null],
    });
  }

  prepareSearchDesForm() {
    this.searchDestructionForm = this.fb.group({
      quantity: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      managementNum: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionGood: [null, [Validators.pattern(STRING_PATTERN)]],
      inventoryNum: [null, [Validators.pattern(STRING_PATTERN)]],
      bienSiabNum: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  prepareSearchForm() {
    this.searchForm = this.fb.group({
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      commercialEvent: [null, [Validators.pattern(STRING_PATTERN)]],
      invoice: [null],
      commercialLot: [null],
      numberSae: [null],
      gestionNumber: [null],
      numberIventory: [null],
    });
  }

  getWarehouseSelect(params: ListParams) {
    params['sortBy'] = `name:ASC`;
    params['filter.name'] = `$ilike:${params.text}`;
    params['filter.regionalDelegation'] = this.regionalDelegationNum;
    params['filter.stockLocatorCtrlCode'] = 3;
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

  typeEventSelect(typeEvent: any) {
    this.idTypeEvent = typeEvent.id;
  }

  saveProgDelivery() {
    this.schedulingDeliverieForm.get('typeUser').setValue(this.typeUser);
    console.log('schedulingDeliverieForm', this.schedulingDeliverieForm.value);
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

  showGoodsInventory() {
    const typeEvent = this.schedulingDeliverieForm.get('typeEvent').value;
    const transferId = this.schedulingDeliverieForm.get('transferId').value;
    if (this.regionalDelegationNum && typeEvent && transferId) {
      const quantity = this.searchDestructionForm.get('quantity').value;
      const managementNum =
        this.searchDestructionForm.get('managementNum').value;
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
        this.paramsSearchDest
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInventaryGoods());
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un almacén y un transferente'
      );
    }
  }

  getInventaryGoods() {
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
  }

  cleanSearchForm() {}

  addEstate(event: Event) {}
}
