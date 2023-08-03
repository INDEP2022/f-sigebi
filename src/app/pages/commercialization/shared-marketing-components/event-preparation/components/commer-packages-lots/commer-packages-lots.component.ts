import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { EventPreparationService } from '../../event-preparation.service';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'commer-packages-lots',
  templateUrl: './commer-packages-lots.component.html',
  styles: [],
})
export class CommerPackagesLotsComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() comerLotsListParams = new BehaviorSubject(new FilterParams());
  @Input() lots = new LocalDataSource();
  @Input() onlyBase = false;
  @Output() fillStadistics = new EventEmitter<void>();
  @Output() onLotSelected = new EventEmitter<IComerLot>();
  comerLot: IComerLot;
  @Input() loggedUser: TokenInfoModel;
  viewRejectedGoods = false;

  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private globalVarsService: GlobalVarsService,
    private eventPreparationService: EventPreparationService,
    private utilComerV1Service: UtilComerV1Service,
    private eventAppService: EventAppService
  ) {
    super();
  }

  override async ngAfterViewInit() {
    super.ngAfterViewInit();
    console.log('AFTER VIEW INIT');
    await this.checkGoodsTracker();
  }

  async ngOnInit() {
    console.warn('INIT');
  }

  async checkGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    const selftState = await this.eventPreparationService.getState();
    const execType = this.onlyBase ? 'base' : 'normal';
    if (selftState.executionType != execType) {
      return;
    }
    const { lastLot, lastPublicLot } = selftState;
    const { REL_BIENES } = global;
    if (!REL_BIENES) {
      return;
    }
    if (REL_BIENES === 0) {
      this.alert('error', 'Error', 'No selecciono ningún bien');
      return;
    }
    if (REL_BIENES) {
      this.processTracker(REL_BIENES, lastLot, lastPublicLot).subscribe();
    }
  }

  processTracker(
    relGoods: string | number,
    lot: string | number,
    lotepub: string | number
  ) {
    console.warn('SE MANDO A LLAMAR');

    const { id, eventTpId } = this.eventForm.controls;
    this.loader.load = true;
    return this.utilComerV1Service
      .processTracker({
        id: relGoods,
        dir: this.parameters.pDirection,
        event: id.value,
        lot,
        tpeve2: eventTpId.value,
        program: 'FCOMEREVENTOS',
        lotepub,
        user: 'DR_SIGEBI',
      })
      .pipe(
        catchError(error => {
          this.loader.load = false;
          this.alert(
            'error',
            'Error',
            'Ocurrió un error al procesar los bienes'
          );
          return throwError(() => error);
        }),
        tap(async res => {
          this.loader.load = false;
          this.alert('success', 'Proceso Terminado', '');
          await this.verifyRejectedGoods();
          this.fillStadistics.emit();
          const params = new FilterParams();
          this.comerLotsListParams.next(params);
        })
      );
  }

  /**VERIFICARECHAZADOS */
  async verifyRejectedGoods() {
    const { id } = this.controls;
    return firstValueFrom(
      this.eventAppService.verifyRejectedGoods(id.value).pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(response => {
          console.warn('VERIFICARECHAZADOS');

          console.log(response);
          const c: any = response;
          if (response.data > 0 || c > 0) {
            this.alert(
              'warning',
              'Advertencia',
              'Hubo Bienes Rechazados pulse el botón de Bienes no Cargados'
            );
          }
        })
      )
    );
  }

  onLotSelect(lot: IComerLot) {
    this.onLotSelected.emit(lot);
    this.comerLot = lot;
  }
}
