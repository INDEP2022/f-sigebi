import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';
import { BasePage } from 'src/app/core/shared';
import { ExpenseConceptsService } from '../../services/expense-concepts.service';

@Component({
  selector: 'app-copyParameters',
  templateUrl: './copyParameters.component.html',
  styleUrls: ['./copyParameters.component.css'],
})
export class CopyParametersComponent
  extends BasePage
  implements ViewCell, OnInit
{
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: IConcept;

  constructor(
    private conceptsService: ConceptsService,
    private expenseConceptService: ExpenseConceptsService
  ) {
    super();
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.alertQuestion(
      'question',
      '¿Desea copiar los parámetros del concepto: ' + this.rowData.id + ' ?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        this.conceptsService
          .copyParameters(this.rowData)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              if (response.data && response.data.length) {
                this.expenseConceptService.concept = this.rowData;
              }
            },
          });
        // this.expenseConceptsService.concept = data;
      }
    });
  }
}
