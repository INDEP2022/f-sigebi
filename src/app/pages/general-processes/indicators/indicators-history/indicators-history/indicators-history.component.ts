import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CaptureDig } from 'src/app/core/models/ms-documents/documents';
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
  columns: CaptureDig[] = [];
  danger: boolean = false;

  //

  constructor(
    private viewService: GoodsQueryService,
    private _domSanitizer: DomSanitizer
  ) {
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
          filter: false,
          type: 'html',
          valuePrepareFunction: (image: any, row: CaptureDig) => {
            return this.assignAndValidateImageOne(row);
          },
        },
        column6: {
          title: 'Dictaminación',
          sort: false,
          filter: false,
        },
        column7: {
          title: 'Recepción Fisica',
          sort: false,
          filter: false,
        },
        column8: {
          title: 'Entregas',
          sort: false,
          filter: false,
        },
        column9: {
          title: 'Comer.',
          sort: false,
          filter: false,
        },
        column10: {
          title: 'Donación',
          sort: false,
          filter: false,
        },
        column11: {
          title: 'Destrucción',
          sort: false,
          filter: false,
        },
        column12: {
          title: 'Devolución',
          sort: false,
          filter: false,
        },
        column13: {
          title: 'Fecha Tecnica',
          sort: false,
          filter: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  getData(params: any) {
    this.loading = true;
    this.viewService.getViewIncRecDoc(params).subscribe({
      next: response => {
        this.columns = response.data;
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

  assignAndValidateImageOne(i: CaptureDig) {
    if (i.fescaneo == null) {
      return this._domSanitizer.bypassSecurityTrustHtml(
        `<img src="../../../../../../../assets/images/no_cumplido.png" alt="Smiley face" height="20" width="100">`
      );
    } else {
      if (i.cant_bien != 0) {
        return this._domSanitizer.bypassSecurityTrustHtml(
          `<img src="../../../../../../../assets/images/cumplido.png" alt="Smiley face" height="20" width="100">`
        );
      }
    }
    return this._domSanitizer.bypassSecurityTrustHtml(
      `<img src="../../../../../../../assets/images/destiempo.png" alt="Smiley face" height="20" width="100">`
    );
  }

  assignAndValidateImageTwo() {}
}
