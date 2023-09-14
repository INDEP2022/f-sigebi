import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ZonesService } from 'src/app/core/services/zones/zones.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  COORDINATIONSZONES_COLUMNS,
  IDataZones,
  ZONES_COLUMNS,
} from './zones-columns';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styles: [],
})
export class ZonesComponent extends BasePage implements OnInit {
  data1: IDataZones[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  rowSelected: any = null;
  idZone: string;
  loading1 = this.loading;
  loading2 = this.loading;

  constructor(private zonesService: ZonesService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...ZONES_COLUMNS,
      },
    };
    this.settings1 = {
      ...this.settings1,
      hideSubHeader: false,
      columns: {
        ...COORDINATIONSZONES_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getZones(this.params.getValue());
    });

    this.params1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      let params = {
        ...this.params1.getValue(),
      };
      params['filter.zoneContractKey'] = `$eq:${this.idZone || ''}`;

      this.getServiceContrat(params);
    });
  }

  getZones(params: ListParams) {
    this.loading1 = true;
    this.zonesService.getZones(params).subscribe({
      next: data => {
        console.log(data);
        this.data1 = data.data.map(item => ({
          ...item,
          vigente: item.statusZone === '1' ? 'Si' : 'No',
        }));
        this.totalItems = data.count;
        this.loading1 = false;
      },
      error: () => (this.loading1 = false),
    });
  }

  selectRow(event: any) {
    this.idZone = event.data.id;

    const params = {
      ...this.params1.getValue(),
      'filter.zoneContractKey': `$eq:${event.data.id}`,
    };
    this.getServiceContrat(params);
  }

  getServiceContrat(params: ListParams) {
    this.loading2 = true;
    this.zonesService.getZoneContractCoordinate(params).subscribe({
      next: data => {
        this.data2 = data.data.map(item => ({
          ...item,
          descripcion: item.delegationNumber?.description || 'SIN DESCRIPCIÓN',
        }));
        this.totalItems1 = data.count || 0;
        this.loading2 = false;
      },
      error: () => {
        this.data2 = [];
        this.loading2 = false;
      },
    });
  }
}
