import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICaptureDig } from 'src/app/core/models/ms-documents/documents';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-indicators-history',
  templateUrl: './indicators-history.component.html',
  styles: [],
})
export class IndicatorsHistoryComponent extends BasePage implements OnInit {
  //

  @ViewChild('grid', { static: false }) grid: Ng2SmartTableComponent;
  @ViewChild('columnContent') columnContent: ElementRef;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: ICaptureDig[] = [];
  danger: boolean = false;

  //

  constructor(private viewService: GoodsQueryService) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
        onCustom: (event: any) => {
          this.onCustom(event);
        },
      },
      columns: {
        coordinacion_regional: {
          title: 'Regional',
          sort: false,
        },
        cve_oficio_externo: {
          title: 'Cve. Oficio Externo',
          sort: false,
        },
        no_expediente: {
          title: 'No. Expediente',
          sort: false,
        },
        no_volante: {
          title: 'No. Volante',
          sort: false,
        },
        column5: {
          title: 'Captura y Digitalización',
          sort: false,
        },
        column6: {
          title: 'Dictaminación',
          sort: false,
        },
        column7: {
          title: 'Recepción Fisica',
          sort: false,
        },
        column8: {
          title: 'Entregas',
          sort: false,
        },
        column9: {
          title: 'Comer.',
          sort: false,
        },
        column10: {
          title: 'Donación',
          sort: false,
        },
        column11: {
          title: 'Destrucción',
          sort: false,
        },
        column12: {
          title: 'Devolución',
          sort: false,
        },
        column13: {
          title: 'Fecha Tecnica',
          sort: false,
        },
      },
    };
  }

  onCustom(event: any) {
    console.log('Seleccionamos la columna vamoooo');
  }

  ngOnInit(): void {}

  getData(params: any) {
    this.loading = true;
    this.viewService.getViewIncRecDoc(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.valueImg(this.columns);
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  valueImg(columns: ICaptureDig[]) {
    for (const i of columns) {
      if (i.fescaneo == null) {
        i.column5 = 'No Cumplido';
      } else if (i.cant_bien != 0) {
        i.column5 = 'Cumplido';
      } else {
        i.column5 = 'Destiempo';
      }
    }
  }

  //
}
