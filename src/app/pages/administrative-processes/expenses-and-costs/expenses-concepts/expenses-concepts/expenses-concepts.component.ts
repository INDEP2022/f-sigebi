import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { EXCHANGE_TYPES_COLUMNS } from './expenses-concepts-columns';

@Component({
  selector: 'app-expenses-concepts',
  templateUrl: './expenses-concepts.component.html',
  styles: [],
})
export class ExpensesConceptsComponent extends BasePage implements OnInit {
  form: FormGroup;

  exchangeTypes: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private expenseService: GoodSpentService
  ) {
    super();
    this.settings.columns = EXCHANGE_TYPES_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExpensesConcepts());
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      clasification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      concept: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  getExpensesConcepts() {
    var info: any[] = [];
    this.loading = true;
    this.expenseService.getExpenseConcept(this.params.getValue()).subscribe({
      next: data => {
        this.exchangeTypes = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
