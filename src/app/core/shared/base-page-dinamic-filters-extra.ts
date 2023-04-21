import { Component } from '@angular/core';
import {
  BasePageWidhtDinamicFilters,
  ServiceGetAll,
} from 'src/app/core/shared/base-page-dinamic-filters';
import { IListResponseMessage } from '../interfaces/list-response.interface';

@Component({
  template: '',
})
export abstract class BasePageWidhtDinamicFiltersExtra<
  B
> extends BasePageWidhtDinamicFilters {
  items: B[] = [];
  override service: ServiceGetAll<IListResponseMessage<B>>;
  constructor() {
    super();
  }
}
