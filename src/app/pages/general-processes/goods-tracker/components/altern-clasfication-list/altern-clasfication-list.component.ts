import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
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
  clasifications: IAlternativeClasification[] = [];
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
        ...ALTERN_CLASIFICATION_COLUMS,
        select: {
          title: 'Selección',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (
            value: boolean,
            clasification: IAlternativeClasification
          ) => this.isSelected(clasification),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (
            instance: CheckboxElementComponent<IAlternativeClasification>
          ) => this.onSelect(instance),
        },
      },
      actions: false,
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
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          this.getAll(params).subscribe();
        })
      )
      .subscribe();
  }

  getAll(params?: FilterParams) {
    const _params = params ?? new FilterParams();
    _params.addFilter('id', 11, SearchFilter.GTE);
    _params.sortBy = 'id:ASC';
    this.loading = true;
    return this.alternClasificationService
      .getAllFilter(_params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.clasifications = [];
          this.totalItems = 0;
          if (error.status >= 500) {
            this.alert(
              'error',
              'Error',
              'Ocurrió un error al obtener la clasificación alterna'
            );
          }
          return throwError(() => error);
        }),
        tap(res => {
          this.loading = false;
          this.clasifications = res.data;
          this.totalItems = res.count;
        })
      );
  }

  confirm() {
    this.modalRef.content.callback(this.selectedClasifications);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
