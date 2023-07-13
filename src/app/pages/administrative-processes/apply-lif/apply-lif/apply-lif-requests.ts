import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryNumeraryService } from 'src/app/core/services/ms-historynumerary/historynumerary.service';
import { MassiveNumeraryService } from 'src/app/core/services/ms-massivenumerary/massivenumerary.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared';

export abstract class ApplyLifRequest extends BasePage {
  protected abstract goodService: GoodService;
  protected abstract massiveNumeraryService: MassiveNumeraryService;
  protected abstract historyNumeraryService: HistoryNumeraryService;
  protected abstract parameterModService: ParameterModService;

  getCountGoodByReference(reference: string): Promise<number> {
    const params = new ListParams();
    params['filter.goodReferenceNumber'] = reference;
    return firstValueFrom(
      this.goodService.getAll(params).pipe(
        map(response => response.count),
        catchError(error => {
          return of(0);
        })
      )
    );
  }

  getGoodParams(listParams: ListParams, isOnlyFirst: boolean = false) {
    return firstValueFrom(
      this.goodService
        .getAll(listParams)
        .pipe(map(response => (isOnlyFirst ? response.data[0] : response)))
    );
  }

  getComerParameterMod(params: ListParams) {
    return firstValueFrom(
      this.parameterModService
        .getAll(params)
        .pipe(map(response => response.data[0]))
    );
  }

  getGoodByReference(goodId: number): Observable<IGood> {
    const params = new ListParams();
    params['filter.goodReferenceNumber'] = goodId;
    return this.goodService.getAll(params).pipe(
      map(response => response.data[0]),
      catchError(error => {
        this.alert(
          'error',
          '',
          'No se encontró el bien con el número de referencia ingresado'
        );
        throw error;
      })
    );
  }

  getChangeNumeraryByGood(goodId: number | string, good1Id: number | string) {
    // SELECT FEC_CAMBIO INTO :BLK_CTR.FEC_CAMBIO
    //     FROM CAMBIO_NUMERARIO
    //  WHERE NO_BIEN_ORIGINAL  = :BIENES.NO_BIEN
    //    AND NO_BIEN_NUMERARIO = :BIENES1.NO_BIEN;
    const params = new ListParams();
    params['filter.goodOriginalNumber'] = goodId;
    params['filter.goodNumeraryNumber'] = good1Id;
    return firstValueFrom(
      this.massiveNumeraryService
        .getAll()
        .pipe(map(response => response.data[0]))
    );
  }

  getHistoricalNumeraryByGood(params: ListParams) {
    // SELECT FECHA_CAMBIO INTO :BLK_CTR.FEC_CAMBIO
    //       FROM HISTORICO_NUMERARIOS
    //      WHERE BIEN_ORIGINAL     = :BIENES.NO_BIEN
    //        AND NO_BIEN_NUMERARIO = :BIENES1.NO_BIEN;

    return firstValueFrom(
      this.historyNumeraryService
        .getAll(params)
        .pipe(map(response => response.data[0]))
    );
  }
}
