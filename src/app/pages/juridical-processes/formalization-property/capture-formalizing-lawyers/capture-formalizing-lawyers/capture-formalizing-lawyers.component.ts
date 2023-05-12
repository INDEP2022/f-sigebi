/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerNotariostercs } from 'src/app/core/models/catalogs/notary.model';
import { ComerNotariesTercsService } from 'src/app/core/services/ms-notary/notary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormCaptureLawyersComponent } from '../form-capture-lawyers/form-capture-lawyers.component';
import { LAWYER_COLUMNS } from './capture-formalizin-lawyers-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-capture-formalizing-lawyers',
  templateUrl: './capture-formalizing-lawyers.component.html',
  styleUrls: ['./capture-formalizing-lawyers.component.scss'],
})
export class CaptureFormalizingLawyersComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  lawyers: IComerNotariostercs[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private comerNotariesTercsService: ComerNotariesTercsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LAWYER_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getLawyers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLawyers());
    // this.getLawyers()
    // this.loading = true;
  }

  add() {
    this.openModal();
  }

  edit(lawyer: IComerNotariostercs) {
    this.openModal({ edit: true, lawyer });
  }

  getLawyers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.comerNotariesTercsService.getAll(params).subscribe(
      response => {
        this.lawyers = response.data;
        this.data.load(this.lawyers);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
        console.log('SI', response);
      },
      error => (this.loading = false)
    );
  }

  showDeleteAlert(lawyer: IComerNotariostercs) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(lawyer.id);
      }
    });
  }

  delete(id: number) {
    console.log('SI', id);
    this.comerNotariesTercsService.remove(id).subscribe({
      next: () => {
        this.getLawyers(),
          this.alert('success', 'ABOGADO FORMALIZADOR', 'Borrado');
      },
      error(err) {
        console.log('ERROR', err);
      },
    });
  }

  openModal(context?: Partial<FormCaptureLawyersComponent>) {
    const modalRef = this.modalService.show(FormCaptureLawyersComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getLawyers();
    });
  }
}
