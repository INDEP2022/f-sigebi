import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PRORRATEO_CONCEPTS_COLUMNS } from './prorrateo-concepts-columns';

@Component({
  selector: 'app-prorrateo-concepts',
  templateUrl: './prorrateo-concepts.component.html',
  styles: [],
})
export class ProrrateoConceptsComponent extends BasePage implements OnInit {
  concepts: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings.columns = PRORRATEO_CONCEPTS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
