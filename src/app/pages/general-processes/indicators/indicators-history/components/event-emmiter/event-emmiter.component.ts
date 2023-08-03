import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { FunctionCumplioIndicador } from '../../indicators-history/indicators-history-columns';
import { IndicatorsHistoryDetailComponent } from '../indicators-history-detail/indicators-history-detail.component';

@Component({
  selector: 'app-event-emmiter',
  templateUrl: './event-emmiter.component.html',
  styles: [],
})
export class EventEmmiterComponent implements OnInit {
  //

  functionCumplioIndicador = new FunctionCumplioIndicador();

  @Input() value: { value: string; type: string; rowData: any };
  @Input() rowData: any;

  @Output() customEvent: EventEmitter<any> = new EventEmitter();

  varOne: boolean = false;
  varTwo: boolean = false;
  varThree: boolean = false;

  //
  constructor(
    private viewService: GoodsQueryService,
    private modalService: BsModalService,
    private serviceDictamination: DictationService
  ) {}

  ngOnInit(): void {
    console.log(
      'Aqui estoy pasando la marca de agua para identificar la columna que esta llamando: ',
      this.value.type
    );

    /**---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

    // console.log("Aqui estamos recibiendo el objeto de las columnas estandar", this.rowData)
    if (this.value.type == 'column-cap-dig') {
      console.log('Primera columna');
      console.log(
        '**************************************************************************'
      );
      if (this.rowData != undefined) {
        if (this.rowData.scanningDate == null) {
          this.varOne = true;
        } else {
          if (
            this.cumplioIndicador(
              this.rowData.startDate,
              this.rowData.scanningDate,
              this.rowData.maximumDate,
              1,
              this.rowData.regionalCoordination
            ) == 1 &&
            this.rowData.quantityGoods != 0
          ) {
            this.varTwo = true;
          } else {
            this.varThree = true;
          }
        }
      } else {
        this.varOne = true;
      }
    }

    /**---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

    //
    if (this.value.type == 'column-dict') {
      this.postColumnCapDig();
    }

    //
  }

  //

  onClick() {
    // console.log("En realidad ejecuta algo internamente nada mas")
  }

  cumplioIndicador(
    dateOne: string,
    dateTwo: string,
    dateThree: string,
    numOne: number,
    numTwo: number
  ): number {
    // console.log("El primer parametro: #", dateOne);
    // console.log("El segundo parametro: #", dateTwo);
    // console.log("El tercero parametro: #", dateThree);
    // console.log("El cuarto parametro: #", numOne);
    // console.log("El quinto parametro: #", numTwo);
    let num: number = -1;
    if (
      this.validGeneral(dateOne) &&
      this.validGeneral(dateTwo) &&
      this.validGeneral(dateThree) &&
      this.validGeneral(numOne) &&
      this.validGeneral(numTwo)
    ) {
      this.functionCumplioIndicador.date1 = dateOne;
      this.functionCumplioIndicador.date2 = dateTwo;
      this.functionCumplioIndicador.dateEnd = dateThree;
      this.functionCumplioIndicador.pNumCor = numOne;
      this.functionCumplioIndicador.TpInd = numTwo;
      this.viewService
        .postFunctionCumplioIndicador(this.functionCumplioIndicador)
        .subscribe({
          next: response => {
            return (num = response);
          },
          error: error => {
            // console.log("Algo salio mal en el componente Goodsquery metodo  cumplioIndicador")
            this.varOne = true;
            return (num = -1);
          },
        });
    } else {
      this.varOne = true;
    }
    return num;
  }

  find() {
    return 'Hola Mundo';
  }

  validGeneral(param: any) {
    if (param != null) {
      return true;
    }
    return false;
  }

  openModal(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) this.find();
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    // console.log('Config: ', config);
    this.modalService.show(IndicatorsHistoryDetailComponent, config);
  }

  postColumnCapDig() {
    console.log('Segunda columna');
    console.log(
      '---------------------------------------------------------------------------------'
    );
    // let body: any;
    // this.serviceDictamination.postHisIndicators(body).subscribe({
    //   next: response => {
    //     console.log("Revisa bien");
    //   },
    //   error: error => {
    //     console.log("Revisa mal")
    //   },
    // });
  }
}
