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
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
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
  comerLot: IComerLot;
  @Input() loggedUser: TokenInfoModel;
  constructor(
    private globalVarsService: GlobalVarsService,
    private eventPreparationService: EventPreparationService,
    private utilComerV1Service: UtilComerV1Service
  ) {
    super();
  }

  async ngAfterContentInit() {
    super.ngAfterViewInit();
    await this.checkGoodsTracker();
  }

  async ngOnInit() {}

  async checkGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    const selftState = await this.eventPreparationService.getState();
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
      this.processTracker(REL_BIENES, lastLot, lastPublicLot).subscribe({
        next: res => {
          this.fillStadistics.emit();
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }

  processTracker(
    relGoods: string | number,
    lot: string | number,
    lotepub: string | number
  ) {
    const { id, eventTpId } = this.eventForm.controls;
    return this.utilComerV1Service.processTracker({
      id: relGoods,
      dir: this.parameters.pDirection,
      event: id.value,
      lot,
      tpeve2: eventTpId.value,
      program: 'FCOMEREVENTOS',
      lotepub,
      user: 'DR_SIGEBI',
    });
  }

  onLotSelect(lot: IComerLot) {
    this.comerLot = lot;
  }
}
