import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISpentConcept } from 'src/app/core/models/ms-spent/spent.model';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';

@Component({
  selector: 'app-select-concept-spent-dialog',
  templateUrl: './select-concept-spent-dialog.component.html',
  styleUrls: ['./select-concept-spent-dialog.component.css'],
})
export class SelectConceptSpentDialogComponent implements OnInit {
  constructor(
    public modalRef: BsModalRef,
    private spentService: SpentService
  ) {}
  // SELECT NO_CONCEPTO_GASTO,DESCRIPCION FROM CONCEPTO_GASTO
  spentConcepts = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedItem: null | ISpentConcept = null;
  isLoading = false;
  textSearch = '';
  settings = {
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: false,
    columns: {
      id: {
        title: 'Id',
        sort: false,
      },
      description: {
        sort: false,
        title: 'Descripción',
      },
      expenseAppCritNumber: {
        sort: false,
        title: 'N° Crit',
      },
      registryNumber: {
        sort: false,
        title: 'N° Registro',
      },
      prorationType: {
        sort: false,
        title: 'Tipo Prorrateo',
      },
    },
  };
  totalItems = 0;

  form = new FormGroup({
    description: new FormControl(''),
  });
  ngOnInit() {
    this.params.subscribe(params => {
      this.getExpensesConcept(params);
    });
  }

  getExpensesConcept(params?: ListParams) {
    if (!params) {
      params = this.params.getValue();
      params['page'] = 1;
    }
    this.isLoading = true;
    params['text'] = this.textSearch;
    const paramsSend = {
      limit: params.limit || 10,
      page: params.page || 1,
      text: this.form.get('description').value,
    };
    this.spentService.getExpensesConcept(paramsSend).subscribe({
      next: response => {
        this.spentConcepts.load(response.data);
        this.totalItems = response.count;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.spentConcepts.load([]);
      },
    });
  }

  onUserRowSelect(event: any) {
    console.log(event.data);

    this.selectedItem = event.data;
    this.modalRef.hide();
  }
}
