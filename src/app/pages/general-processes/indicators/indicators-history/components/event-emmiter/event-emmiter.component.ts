import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, map, Observable, of } from 'rxjs';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { FunctionCumplioIndicador } from '../../indicators-history/indicators-history-columns';
import { IndicatorsHistoryDetailComponent } from '../indicators-history-detail/indicators-history-detail.component';

export class LocalDictamination {
  p_expediente: number;
  p_volante: number;
}

export class LocalResponseDictamination {
  finiind: string;
  ffinaliza: string;
  fmaxima: string;
  no_indicador: number;
  coordinacion_regional: string;
}

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
  varResponseColumnTwo: any;

  //
  constructor(
    private viewService: GoodsQueryService,
    private modalService: BsModalService,
    private serviceDictamination: DictationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(
      'Aqui estoy pasando la marca de agua para identificar la columna que esta llamando: ',
      this.value.type
    );

    if (this.rowData != undefined) {
      /**---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

      // console.log("Aqui estamos recibiendo el objeto de las columnas estandar", this.rowData)
      if (this.value.type == 'column-cap-dig') {
        // console.log('Primera columna');
        // console.log(
        //   '**************************************************************************'
        // );
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
        /**---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

        if (this.value.type == 'column-dict') {
          // console.log("Si la fecha se paso desde arriba, aqui deberia mostrar algo: ", this.value.value)
          // if (Number(this.value.value) == 1) {
          console.log('Por aqui esta viajando');
          if (true) {
            this.postColumnCapDig(
              this.rowData.fileNumber,
              this.rowData.flyerNumber
            ).subscribe(localResponse => {
              // console.log("======================================================================================================================================================")
              // console.log("En la parte inicial esta recibiendo la respuesta de la primera consulta de la primera validacion de la asignacion de la imagen -----------------------");
              // console.log("Este es el objeto: ", localResponse);
              // console.log("Ahora la fecha con la que vamos a hacer la validacion es esta: ", localResponse[0]?.ffinaliza);
              // console.log("======================================================================================================================================================")
              if (
                localResponse[0]?.ffinaliza == null ||
                localResponse[0]?.ffinaliza == undefined
              ) {
                this.varOne = true;
                console.log('Por aqui esta viajando var one');
              } else {
                if (
                  this.cumplioIndicador(
                    localResponse[0]?.finiind,
                    localResponse[0]?.ffinaliza,
                    localResponse[0]?.fmaxima,
                    localResponse[0]?.no_indicador,
                    Number(localResponse[0]?.coordinacion_regional)
                  ) == 1
                ) {
                  this.varTwo = true;
                  console.log('Por aqui esta viajando var two');
                } else {
                  this.varThree = true;
                  console.log('Por aqui esta viajando var three');
                }
              }
              this.cd.detectChanges();
            });
          }
        } else {
          console.log('Hola Mundo');
        }
      }
    }
  }

  //

  onClick() {
    // console.log("En realidad ejecuta algo internamente nada mas")
  }

  //Primera columna procedimiento
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
            return (num = -1);
          },
        });
    } else {
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

  //Segunta columna, procedimiento
  postColumnCapDig(
    numOne: number,
    numTwo: number
  ): Observable<LocalResponseDictamination[]> {
    console.log('Segunda columna');
    console.log(
      '---------------------------------------------------------------------------------'
    );
    let body = new LocalDictamination();
    let localNullResponse: LocalResponseDictamination[] = [];
    body.p_expediente = numOne == null ? -1 : numOne;
    body.p_volante = numTwo == null ? -1 : numTwo;
    return this.serviceDictamination.postHisIndicators(body).pipe(
      map(response => {
        // console.log("La respuesta de la segunda columna esta bien, trajo esto: ", response);
        return response.data;
      }),
      catchError(error => {
        // console.log("La respuesta de la segunda columna esta mal, trajo esto: ", error);
        return of(localNullResponse);
      })
    );
  }
}
