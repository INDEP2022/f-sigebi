import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONCEPTS_COLUMNS } from './concepts-columns';

@Component({
  selector: 'app-catalogue-expenses-concepts',
  templateUrl: './catalogue-expenses-concepts.component.html',
  styles: [],
})
export class CatalogueExpensesConceptsComponent
  extends BasePage
  implements OnInit
{
  concepts: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings.columns = CONCEPTS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
