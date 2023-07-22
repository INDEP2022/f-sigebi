import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { FormControl } from '@angular/forms';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { ExpenseConceptsService } from '../services/expense-concepts.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-expense-concepts-list',
  templateUrl: './expense-concepts-list.component.html',
  styleUrls: ['./expense-concepts-list.component.scss'],
})
export class ExpenseConceptsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IConcept>
  implements OnInit
{
  toggleInformation = true;
  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  constructor(
    private modalRef: BsModalRef,
    private conceptsService: ConceptsService,
    private expenseConceptsService: ExpenseConceptsService
  ) {
    super();
    this.params.value.limit = 5;
    this.service = this.conceptsService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'left',
        add: true,
        edit: true,
        delete: true,
      },
      columns: { ...COLUMNS },
    };

    // this.settings2.columns = COLUMNS2;
  }

  private getAddressCode(address: string) {
    switch (address) {
      case 'MUEBLES':
        return 'M';
      case 'INMUEBLES':
        return 'I';
      case 'GENERAL':
        return 'C';
      case 'VIGILANCIA':
        return 'V';
      case 'SEGUROS':
        return 'S';
      case 'JURIDICO':
        return 'J';
      case 'ADMINISTRACIÓN':
        return 'A';
      default:
        return '';
    }
  }

  override getParams() {
    debugger;
    let newColumnFilters = this.columnFilters;
    if (newColumnFilters['filter.address']) {
      newColumnFilters['filter.address'] =
        '$eq:' +
        this.getAddressCode(
          (newColumnFilters['filter.address'] + '').replace('$eq:', '')
        );
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  edit(data: IConcept) {
    console.log(data);
    // this.alertQuestion(
    //   'question',
    //   '¿Desea copiar los parámetros del concepto: ' + data.id + ' ?',
    //   ''
    // ).then(question => {
    //   if (question.isConfirmed) {
    //     this.conceptsService
    //       .copyParameters(data)
    //       .pipe(takeUntil(this.$unSubscribe))
    //       .subscribe({
    //         next: response => {
    //           this.expenseConceptsService.concept = data;
    //         },
    //       });
    //   }
    // });
  }

  // settingsChange2($event: any): void {
  //   this.settings2 = $event;
  // }
}
