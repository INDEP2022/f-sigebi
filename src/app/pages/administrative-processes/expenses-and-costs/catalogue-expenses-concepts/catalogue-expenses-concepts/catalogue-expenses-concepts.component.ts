import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatalogueExpensesModalComponent } from '../catalogue-expenses-modal/catalogue-expenses-modal.component';
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
  dataLocal: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private expenseService: ExpenseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CONCEPTS_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.filter();
  }

  loadTable() {
    this.concepts = [];
    this.dataLocal.load(this.concepts);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log('params ', params);
    this.expenseService.getDataExpense(params).subscribe({
      next: response => {
        console.log('response DataState --> ', response);
        for (let i = 0; i < response.data.length; i++) {
          let params = {
            notConceptSpent: response.data[i].notConceptSpent,
            description: response.data[i].description,
            notCriterionApplicationSpent:
              response.data[i].notCriterionApplicationSpent,
          };
          this.concepts.push(params);
          this.dataLocal.load(this.concepts);
          this.totalItems = response.count;
        }
      },
    });
  }

  // filterColumnsTable() {
  //   this.dataLocal
  //     .onChanged()
  //     .pipe(takeUntil(this.$unSubscribe))
  //     .subscribe(change => {
  //       if (change.action === 'filter') {
  //         let filters = change.filter.filters;
  //         filters.map((filter: any) => {
  //           let field = '';
  //           let searchFilter = SearchFilter.ILIKE;
  //           field = `filter.${filter.field}`;
  //           /*SPECIFIC CASES*/
  //           switch (filter.field) {
  //             case 'notConceptSpent':
  //               searchFilter = SearchFilter.EQ;
  //               break;
  //             case 'description':
  //               searchFilter = SearchFilter.ILIKE;
  //               break;
  //             case 'notCriterionApplicationSpent':
  //               searchFilter = SearchFilter.EQ;
  //               break;
  //             default:
  //               searchFilter = SearchFilter.EQ;
  //               break;
  //           }
  //           if (filter.search !== '') {
  //             this.columnFilters[field] = `${searchFilter}:${filter.search}`;
  //           } else {
  //             delete this.columnFilters[field];
  //           }
  //         });
  //         this.params = this.pageFilter(this.params);
  //         this.loadTable();
  //       }
  //     });
  //   this.params
  //     .pipe(takeUntil(this.$unSubscribe))
  //     .subscribe(() => this.loadTable());
  // }

  filter() {
    this.dataLocal
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'notConceptSpent':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'notCriterionApplicationSpent':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.loadTable();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadTable());
  }

  loadEdit(data: any) {
    console.log('Edit', data);
  }

  openNew(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, si: boolean) => {
          if (next == true && si == true) {
            console.log('es true');
            this.loadTable();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatalogueExpensesModalComponent, config);
  }

  delete(data?: any) {
    this.alertQuestion(
      'question',
      'Se eliminara el concepto No. ' +
        data.notConceptSpent +
        ' ¿Deseas continuar ? ',
      '',
      'Aceptar',
      'Cancelar'
    ).then(question => {
      if (question.isConfirmed) {
        this.expenseService.deleteDataExpense(data.notConceptSpent).subscribe({
          next: response => {
            console.log('delete response => ', response);
            this.loadTable();
            this.alert(
              'success',
              'Exitoso!',
              'El registro fue eliminado correctamente.'
            );
          },
          error: err => {
            this.alert(
              'error',
              'Error',
              'Hubo un error, intentelo nuevamente.'
            );
          },
        });
      }
    });
  }
}
