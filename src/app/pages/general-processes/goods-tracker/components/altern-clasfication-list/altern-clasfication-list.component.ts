import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAlternativeClasification } from 'src/app/core/models/ms-good/alternative-clasification.model';
import { AlternClasificationService } from 'src/app/core/services/ms-good/altern-clasification.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { ALTERN_CLASIFICATION_COLUMS } from './alter-clasification-columns';

@Component({
  selector: 'app-altern-clasfication-list',
  templateUrl: './altern-clasfication-list.component.html',
  styles: [],
})
export class AlternClasficationListComponent
  extends BasePage
  implements OnInit
{
  clasifications = new LocalDataSource();
  selectedClasifications: IAlternativeClasification[] = [];
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());
  constructor(
    private alternClasificationService: AlternClasificationService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        select: {
          title: 'Selección',
          sort: false,
          type: 'custom',
          filter: false,
          valuePrepareFunction: (
            value: boolean,
            clasification: IAlternativeClasification
          ) => this.isSelected(clasification),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (
            instance: CheckboxElementComponent<IAlternativeClasification>
          ) => this.onSelect(instance),
        },
        ...ALTERN_CLASIFICATION_COLUMS,
      },
      actions: false,
      hideSubHeader: false,
    };
  }

  isSelected(clasification: IAlternativeClasification) {
    const exists = this.selectedClasifications.find(
      clasif => clasif.id == clasification.id
    );
    return exists ? true : false;
  }

  onSelect(instance: CheckboxElementComponent<IAlternativeClasification>) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.selectClasification(data.row, data.toggle),
    });
  }

  selectClasification(
    clasfication: IAlternativeClasification,
    selected: boolean
  ) {
    if (selected) {
      this.selectedClasifications.push(clasfication);
    } else {
      this.selectedClasifications = this.selectedClasifications.filter(
        clasif => clasif.id != clasfication.id
      );
    }
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getLots(params).subscribe())
      )
      .subscribe();
  }

  columnsFilter() {
    return this.clasifications.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getLots(params: FilterParams) {
    const _params = params ?? new FilterParams();
    _params.addFilter('id', 11, SearchFilter.GTE);
    _params.sortBy = 'id:ASC';
    this.loading = true;
    return this.alternClasificationService
      .getAllFilter(_params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.clasifications.load([]);
          this.clasifications.refresh();
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          console.log(response.data);
          this.clasifications.load(response.data);
          this.clasifications.refresh();
          this.totalItems = response.count;
        })
      );
  }

  // ngOnInit(): void {
  //   this.params
  //     .pipe(
  //       takeUntil(this.$unSubscribe),
  //       tap(params => {
  //         this.getAll(params).subscribe();
  //       })
  //     )
  //     .subscribe();
  // }

  confirm() {
    this.modalRef.content.callback(this.selectedClasifications);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
