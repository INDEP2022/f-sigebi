import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';

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

  constructor(
    private modalService: BsModalService,
    private warehouseService: WarehouseService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        idWarehouse: {
          title: 'No',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '20%',
          sort: false,
        },
        ubication: {
          title: 'Ubicacion',
          width: '20%',
          sort: false,
        },
        manager: {
          title: 'Responsable',
          width: '10%',
          sort: false,
        },
        stateCode: {
          title: 'Entidad',
          width: '10%',
          sort: false,
        },
        municipalityCode: {
          title: 'Municipio',
          width: '10%',
          sort: false,
        },
        cityCode: {
          title: 'Ciudad',
          width: '10%',
          sort: false,
        },
        localityCode: {
          title: 'Localidad',
          width: '10%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getWarehouses());
  }

  select(event: IWarehouse) {
    event
      ? this.openModal(event.idWarehouse)
      : this.alert('info', 'Ooop...', 'Este Almacen no contiene Bines');
  }

  openModal(idWarehouse: any): void {
    this.modalService.show(ModalListGoodsComponent, {
      initialState: idWarehouse,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  getWarehouses() {
    this.loading = true;
    this.warehouseService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
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

        this.totalItems = response.count;
        this.loading = false;
        console.log(this.warehouses);
      },
      error: error => (this.loading = false),
    });
  }
}
