import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, firstValueFrom, map, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SAT_CATALOGS_COLUMNS } from './sat-catalogs-columns';

@Component({
  selector: 'app-sat-catalogs',
  templateUrl: './sat-catalogs.component.html',
  styles: [],
})
export class SatCatalogsComponent extends BasePage implements OnInit {
  val: any;
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  @Input() count: number = 0;
  // @Input() filter: any;
  @Output() countData: EventEmitter<any> = new EventEmitter();
  @Input() data: any[] = [];

  @Input() set filter(val: any) {
    if (val) {
      this.getAllComer(val);
    } else {
      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
    }
  }

  get filter() {
    return this.val;
  }

  constructor(private comerInvoice: ComerInvoiceService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SAT_CATALOGS_COLUMNS },
    };
  }

  async setData(data: any[], params: any) {
    const dataDesc = await this.getDataInvoice(params);
    data.map((val, index) => {
      val.payment = dataDesc[index].desc_formapago;
      val.prod = dataDesc[index].desc_prodserv_sat;
      val.relation = dataDesc[index].desc_tipo_relacion_sat;
      val.unite = dataDesc[index].desc_unidad_sat;
      val.usoComp = dataDesc[index].desc_uso_comp;
    });

    this.loading = false;
    this.dataFilter.load(data);
    this.dataFilter.refresh();
    this.totalItems = data.length;
  }

  async getDataInvoice(params: any) {
    return firstValueFrom(
      this.comerInvoice.getDescInvoice(params).pipe(
        map(resp => resp.data),
        catchError(err => of([]))
      )
    );
  }

  ngOnInit(): void {
    // this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   if (this.count > 0) this.getAllComer();
    // });
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue().take = 500;
  }

  getAllComer(filter: any) {
    const params = {
      ...filter,
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      // ...{ sortBy: 'batchId:ASC' },
    };

    this.loading = true;
    this.comerInvoice.getAllSumInvoice(params).subscribe({
      next: resp => {
        if (resp.count == 0) {
          this.loading = false;
          this.count = 0;
          this.dataFilter.load([]);
          this.dataFilter.refresh();
        }

        this.count = resp.count;
        this.setData(resp.data, params);
      },
      error: () => {
        this.loading = false;
        this.count = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}
