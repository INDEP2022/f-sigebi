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
  warehouses: IWarehouse[] = [];
  data: ExampleWarehouse[] = [
    {
      number: 1,
      description: 'Descripción 1',
      location: 'Ubicacion 1',
      responsible: 'Responsable 1',
      entity: 'Entidad 1',
      municipality: 'Municipio 1',
      city: 'Ciudad 1',
      locality: 'Localidad 1',
      goods: [
        {
          numberGood: 1,
          description: 'Descripción 1',
          quantity: 1000,
          dossier: 'Expediente 1',
        },
        {
          numberGood: 2,
          description: 'Descripción 2',
          quantity: 2000,
          dossier: 'Expediente 2',
        },
        {
          numberGood: 3,
          description: 'Descripción 3',
          quantity: 3000,
          dossier: 'Expediente 3',
        },
      ],
    },
    {
      number: 2,
      description: 'Descripción 2',
      location: 'Ubicacion 2',
      responsible: 'Responsable 2',
      entity: 'Entidad 2',
      municipality: 'Municipio 2',
      city: 'Ciudad 2',
      locality: 'Localidad 2',
    },
  ];

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
          width: '10%',
          sort: false,
        },
        responsibleDelegation: {
          title: 'Responsable',
          width: '10%',
          sort: false,
        },
        entity: {
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
        this.warehouses = response.data;
        this.totalItems = response.count;
        this.loading = false;
        console.log(this.warehouses);
      },
      error: error => (this.loading = false),
    });
  }
}
