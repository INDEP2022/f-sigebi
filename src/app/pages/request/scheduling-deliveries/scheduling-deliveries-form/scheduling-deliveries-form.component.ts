import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SCHEDULING_DELIVERIES_COLUMNS,
  SCHEDULING_DELIVERIES_SALES_COLUMNS,
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
  showSearchForm: boolean = true;
  searchForm: FormGroup = new FormGroup({});
  goodsToProgram: any[] = [];
  SearchSalesData: any[] = [];
  goodsToProgramData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
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
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService
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
    this.prepareForm();
    this.prepareSearchForm();
    this.getWarehouseSelect(new ListParams());
  }

  prepareForm() {
    const tomorrow = addDays(new Date(), 1);
    this.schedulingDeliverieForm = this.fb.group({
      typeEvent: [null],
      dateStartDelivery: [
        null,
        [Validators.required, minDate(new Date(tomorrow))],
      ],
      warehouse: [null],
      dateEndDelivery: [
        null,
        [Validators.required, minDate(new Date(tomorrow))],
      ],
      transferent: [null],
      client: [null],
      emails: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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
    if (params.text) {
      this.warehouseService.search(params).subscribe(data => {
        console.log('almacenes', data);
        this.warehouse = new DefaultSelect(data.data, data.count);
      });
    } else {
      this.warehouseService.getAll(params).subscribe(data => {
        console.log('almacenes', data);
        this.warehouse = new DefaultSelect(data.data, data.count);
      });
    }
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

  addEstate(data: any) {
    /*this.goodsToProgram = Object.assign({}, this.goodsToProgramData);
    this.goodsToProgram.push(data);
    this.goodsToProgramData = this.goodsToProgram;
    this.sourceChange.emit(true); */

    const goodsToProgramData = Object.assign({}, this.goodsToProgramData);
    goodsToProgramData.push(data);
    this.goodsToProgramData = goodsToProgramData;

    /*const dataSource = this.goodsToProgramData;
    dataSource.push(data);
    this.goodsToProgramData = dataSource;
    console.log(this.goodsToProgramData); */

    /*const dataSource = Object.assign({}, this.goodsToProgramData);
    dataSource.push(data);
    this.goodsToProgramData = dataSource; */
  }
}
