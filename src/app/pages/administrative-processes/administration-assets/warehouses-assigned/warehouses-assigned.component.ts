import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-warehouses-assigned',
  templateUrl: './warehouses-assigned.component.html',
  styles: [],
})
export class WarehousesAssignedComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  good: IGood;
  constructor(
    private readonly goodServices: GoodService,
    private readonly warehouseService: WarehouseService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Almacen',
        width: '20%',
        sort: false,
      },
      address: {
        title: 'Ubicación',
        width: '70%',
        sort: false,
      },
      lot: {
        title: 'Lote',
        width: '70%',
        sort: false,
      },
      rack: {
        title: 'Rack',
        width: '70%',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Entrada',
        width: '70%',
        sort: false,
      },
      outDate: {
        title: 'Fecha Salida',
        width: '70%',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.search(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search(this.goodId));
  }

  search(idGood: number) {
    this.loading = true;
    this.goodServices.getById(idGood).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        if (this.good.storeNumber !== null) {
          this.warehouseService.getById(this.good.storeNumber).subscribe({
            next: (respo: any) => {
              this.list = response.data.map((good: IGood) => {
                return {
                  id: good.storeNumber,
                  address: respo.ubication,
                  lot: good.lotNumber,
                  rack: good.rackNumber,
                  entryDate: good.dateIn,
                  outDate: good.dateOut,
                };
              });
            },
            error: err => console.log(err),
          });
          this.totalItems = response.count;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }
}
