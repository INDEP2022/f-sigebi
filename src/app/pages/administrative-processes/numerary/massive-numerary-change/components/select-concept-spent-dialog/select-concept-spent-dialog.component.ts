import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';

@Component({
  selector: 'app-select-concept-spent-dialog',
  templateUrl: './select-concept-spent-dialog.component.html',
  styleUrls: ['./select-concept-spent-dialog.component.css'],
})
export class SelectConceptSpentDialogComponent implements OnInit {
  constructor(
    private modalRef: BsModalRef,
    private spentService: SpentService
  ) {}
  // SELECT NO_CONCEPTO_GASTO,DESCRIPCION FROM CONCEPTO_GASTO
  spentConcepts = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  isLoading = false;
  textSearch = '';
  settings = {
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: true,
      edit: true,
      delete: false,
    },
    hideSubHeader: true,
    columns: {
      id: {
        title: 'Id',
      },
      description: {
        title: 'Descripción',
      },
      expenseAppCritNumber: {
        title: 'N° Crit',
      },
      registryNumber: {
        title: 'N° Registro',
      },
      prorationType: {
        title: 'Tipo Prorrateo',
      },
    },
  };
  totalItems = 0;
  ngOnInit() {
    this.params.subscribe(params => {
      this.getExpensesConcept(params);
    });
  }

  getExpensesConcept(params: ListParams) {
    this.isLoading = true;
    this.spentService.getExpensesConcept(params).subscribe(response => {
      this.spentConcepts.load(response.data);
      this.totalItems = response.count;
      this.isLoading = false;
    });
  }
}
