import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICaptureDigViewHistoryIndicators } from 'src/app/core/models/ms-documents/documents';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EventEmitterTwoComponent } from '../components/event-emitter-two/event-emitter-two.component';
import { EventEmmiterComponent } from '../components/event-emmiter/event-emmiter.component';
import { FunctionCumplioIndicador } from './indicators-history-columns';

@Component({
  selector: 'app-indicators-history',
  templateUrl: './indicators-history.component.html',
  styles: [],
})
export class IndicatorsHistoryComponent extends BasePage implements OnInit {
  //

  @ViewChild('columnContent') columnContent: ElementRef;

  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns: ICaptureDigViewHistoryIndicators[] = [];

  noVolante: number;
  noExpediente: number;
  totalItems: number = 0;
  danger: boolean = false;
  globalDate: number;
  numberCumplio: number;
  functionCumplioIndicador = new FunctionCumplioIndicador();
  resultDate: number = 0;

  //

  constructor(
    private viewService: GoodsQueryService,
    private _domSanitizer: DomSanitizer,
    private dynamicCatalogService: DynamicCatalogService,
    private datePipe: DatePipe
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
      // columns: {
      //   coordinacion_regional: {
      //     title: 'Regional',
      //     sort: false,
      //   },
      //   cve_oficio_externo: {
      //     title: 'Cve. Oficio Externo',
      //     sort: false,
      //   },
      //   no_expediente: {
      //     title: 'No. Expediente',
      //     sort: false,
      //   },
      //   no_volante: {
      //     title: 'No. Volante',
      //     sort: false,
      //   },
      //   column5: {
      //     title: 'Captura y Digitalización',
      //     sort: false,
      //     filter: false,
      //     type: 'html',
      //     valuePrepareFunction: (image: any, row: ICaptureDigViewHistoryIndicators) => {
      //       return this.assignAndValidateImageOne(row);
      //     },
      //   },
      //   column6: {
      //     title: 'Dictaminación',
      //     sort: false,
      //     filter: false,
      //   },
      //   column7: {
      //     title: 'Recepción Fisica',
      //     sort: false,
      //     filter: false,
      //   },
      //   column8: {
      //     title: 'Entregas',
      //     sort: false,
      //     filter: false,
      //   },
      //   column9: {
      //     title: 'Comer.',
      //     sort: false,
      //     filter: false,
      //   },
      //   column10: {
      //     title: 'Donación',
      //     sort: false,
      //     filter: false,
      //   },
      //   column11: {
      //     title: 'Destrucción',
      //     sort: false,
      //     filter: false,
      //   },
      //   column12: {
      //     title: 'Devolución',
      //     sort: false,
      //     filter: false,
      //   },
      //   column13: {
      //     title: 'Fecha Tecnica',
      //     sort: false,
      //     filter: false,
      //   },
      // },
      columns: {
        regionalCoordination: {
          title: 'Regional',
          sort: false,
        },
        externalLetterCode: {
          title: 'Cve. Oficio Externo',
          sort: false,
        },
        fileNumber: {
          title: 'No. Expediente',
          sort: false,
        },
        flyerNumber: {
          title: 'No. Volante',
          sort: false,
        },
        column5: {
          title: 'Captura y Digitalización',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: cell, type: 'column-cap-dig', rowData: row };
          },
        },
        column6: {
          title: 'Dictaminación',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
          valuePrepareFunction: (cell: any, row: any) => {
            return {
              value: this.resultDate,
              type: 'column-dict',
              rowData: row,
            };
          },
        },
        column7: {
          title: 'Recepción Fisica',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column8: {
          title: 'Entregas',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column9: {
          title: 'Comer.',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column10: {
          title: 'Donación',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column11: {
          title: 'Destrucción',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column12: {
          title: 'Devolución',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmmiterComponent,
        },
        column13: {
          title: 'Ficha Tecnica',
          sort: false,
          filter: false,
        },
        column14: {
          title: 'Est. Admon. y Rep. Imp.',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: EventEmitterTwoComponent,
        },
      },
    };
  }

  ngOnInit(): void {}

  //

  getDate(date: string) {
    let dateLocal = this.convertDate(date);
    console.log(
      'La fecha que se recibe desde arriba, la fecha inicial: ',
      dateLocal
    );
    if (dateLocal != undefined && dateLocal != null) {
      this.vEtapa(dateLocal);
      console.log(
        'El resultado de la fecha que se pasa del primer formulario: ',
        this.resultDate
      );
    }
  }

  getData(params: any) {
    this.loading = true;
    this.viewService.getViewIncRecDoc(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(this.columns);
        this.totalItems = response.count | 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        if (error.data == null) {
          this.data.load([]);
          this.alert('warning', 'Advertencia', 'No se encontraron registros');
        }
        console.log('En realidad pasa por aqui abajo.');
        this.loading = false;
      },
    });
  }

  // assignAndValidateImageOne(i: ICaptureDigViewHistoryIndicators) {
  //   this.functionCumplioIndicador.date1 = i.startDate;
  //   this.functionCumplioIndicador.date2 = i.scanningDate;
  //   this.functionCumplioIndicador.dateEnd = i.maximumDate;
  //   this.functionCumplioIndicador.pNumCor = 1;
  //   this.functionCumplioIndicador.TpInd = i.regionalCoordination;

  //   if (i.scanningDate == null) {
  //     return this._domSanitizer.bypassSecurityTrustHtml(
  //       `<img src="../../../../../../../assets/images/no_cumplido.png" alt="Smiley face" height="20" width="100">`
  //     );
  //   } else {
  //     if (this.numberCumplio == 1 && i.quantityGoods != 0) {
  //       return this._domSanitizer.bypassSecurityTrustHtml(
  //         `<img src="../../../../../../../assets/images/cumplido.png" alt="Smiley face" height="20" width="100">`
  //       );
  //     } else {
  //       return this._domSanitizer.bypassSecurityTrustHtml(
  //         `<img src="../../../../../../../assets/images/destiempo.png" alt="Smiley face" height="20" width="100">`
  //       );
  //     }
  //   }
  // }

  // onUserRowSelect(event: any) {
  //   this.noVolante = event.selected[0].flyerNumber | 0;
  //   this.noExpediente = event.selected[0].fileNumber | 0;
  // }

  cumplioIndicador(body: FunctionCumplioIndicador) {
    this.viewService.postFunctionCumplioIndicador(body).subscribe({
      next: response => {
        console.log('La respuesta primera: ', response);
        this.numberCumplio = response;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  vEtapa(fecha: string) {
    return new Promise<number>((res, _rej) => {
      this.dynamicCatalogService.faEtapaind(fecha).subscribe({
        next: resp => {
          console.log(resp);
          this.resultDate = Number(resp.data[0].fa_etapaind);
          console.log(
            'Primero la variable que almacena la fecha: ',
            this.resultDate,
            ' --- ahora la variable que se recibe con el valor ---',
            Number(resp.data[0].fa_etapaind)
          );
        },
        error: _err =>
          console.log('Algo salio mal en el resultado de la fecha.'),
      });
    });
  }

  convertDate(value: string) {
    let date: string;
    date = this.datePipe.transform(value, 'dd/MM/yyyy');
    return date;
  }

  //
}
