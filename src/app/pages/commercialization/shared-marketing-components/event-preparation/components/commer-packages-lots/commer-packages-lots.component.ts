import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { BasePage } from 'src/app/core/shared';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'commer-packages-lots',
  templateUrl: './commer-packages-lots.component.html',
  styles: [],
})
export class CommerPackagesLotsComponent extends BasePage implements OnInit {
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() comerLotsListParams = new BehaviorSubject(new FilterParams());
  @Input() lots = new LocalDataSource();
  @Input() onlyBase = false;
  comerLot: IComerLot;
  constructor() {
    super();
  }

  ngOnInit(): void {}

  onLotSelect(lot: IComerLot) {
    this.comerLot = lot;
  }
}
