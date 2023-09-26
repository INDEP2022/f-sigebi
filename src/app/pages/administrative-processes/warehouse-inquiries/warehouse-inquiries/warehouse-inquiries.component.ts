import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';
import { COUNT_WAREHOUSE_COLUMNS } from '../warehouse-columns';

export interface ExampleWarehouse {
  number: number;
  description: string;
  location: string;
  responsible: string;
  entity: string;
  municipality: string;
  city: string;
  locality: string;
  goods?: ExapleGoods[];
}

export interface ExapleGoods {
  numberGood: number;
  description: string;
  quantity: number;
  dossier: string;
}

@Component({
  selector: 'app-warehouse-inquiries',
  templateUrl: './warehouse-inquiries.component.html',
  styles: [],
})
export class WarehouseInquiriesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  warehouses: any[] = [];
  origin: string = '';
  dataFactGen: LocalDataSource = new LocalDataSource();
  origin2: string = '';
  origin3: string = '';
  origin4: string = '';
  screenKey = 'FGERADBALMACENES';
  paramsScreen: IParamsWare = {
    origin: '',
    PAR_MASIVO: '', // PAQUETE
  };
  columnFilters: any = [];
  @Input() PAR_MASIVO: string;
  @ViewChild('goodNumber') goodNumber: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private warehouseService: WarehouseService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_WAREHOUSE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        console.log(this.paramsScreen);
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin2']
          ? params['origin2']
          : params['origin'] ?? null;
        this.origin2 = params['origin3'] ?? null;
        this.origin3 = params['origin4'] ?? null;
        this.origin4 = params['origin5'] ?? null;
        this.PAR_MASIVO = params['PAR_MASIVO'] ?? null;
        if (this.origin && this.paramsScreen.PAR_MASIVO != null) {
          // this.btnSearchAppointment();
        }
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_MASIVO) {
        this.getWarehouses();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          console.log(this.origin);
        }
      }
    }
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'idWarehouse' ||
            filter.field == 'description' ||
            filter.field == 'ubication' ||
            filter.field == 'manager' ||
            filter.field == 'stateCode' ||
            filter.field == 'municipalityCode' ||
            filter.field == 'cityCode' ||
            filter.field == ' localityCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getWarehouses();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getWarehouses());
  }

  select(event: IWarehouse) {
    console.error(event);
    this.openModal(event.idWarehouse);
  }

  /*   openModal1(idWarehouse: any): void {
    this.modalService.show(ModalListGoodsComponent, {
      initialState: idWarehouse,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openModal12(idWarehouse: any) {
    let config: ModalOptions = {
      initialState: {
        idWarehouse: idWarehouse,
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-sm', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(ModalListGoodsComponent, config);
  } */

  openModal(idWarehouse: any) {
    let config: ModalOptions = {
      initialState: {
        idWarehouse,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalListGoodsComponent, config);
  }

  getWarehouses() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.warehouseService.getAll(params).subscribe({
      next: response => {
        this.warehouses = response.data.map(ware => {
          return {
            idWarehouse: ware.idWarehouse,
            description: ware.description,
            indActive: ware.indActive,
            localityCode: ware.localityCode
              ? ware.localityCode.nameLocation
              : null,
            cityCode: ware.cityCode ? ware.cityCode.nameCity : '',
            manager: ware.manager,
            municipalityCode: ware.municipalityCode
              ? ware.municipalityCode.nameMunicipality
              : null,
            registerNumber: ware.registerNumber,
            responsibleDelegation: ware.responsibleDelegation,
            stateCode: ware.stateCode ? ware.stateCode.descCondition : '',
            type: ware.type,
            ubication: ware.ubication,
          };
        });
        this.dataFactGen.load(this.warehouses);
        this.dataFactGen.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  goBack() {
    this.router.navigate(['/pages/administrative-processes/location-goods'], {
      queryParams: {
        origin2: this.screenKey,
        PAR_MASIVO: this.goodNumber,
        origin: 'FACTADBUBICABIEN',
        origin3: 'FACTGENACTDATEX',
        origin4: 'FCONADBALMACENES',
        ...this.paramsScreen,
      },
    });
  }
}
export interface IParamsWare {
  origin: string;
  PAR_MASIVO: string;
}
