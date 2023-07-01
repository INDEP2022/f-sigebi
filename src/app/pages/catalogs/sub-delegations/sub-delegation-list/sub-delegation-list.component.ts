import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SubDelegationFormComponent } from '../sub-delegation-form/sub-delegation-form.component';
import { SUB_DELEGATION_COLUMS } from './sub-delegation-columns';

@Component({
  selector: 'app-sub-delegation-list',
  templateUrl: './sub-delegation-list.component.html',
  styles: [],
})
export class SubDelegationListComponent extends BasePage implements OnInit {
  paragraphs: ISubdelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private subdelegationService: SubdelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SUB_DELEGATION_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'delegationNumber' ||
            filter.field == 'dailyConNumber' ||
            filter.field == 'dateDailyCon' ||
            filter.field == 'phaseEdo'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.subdelegationService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(subdelegation?: ISubdelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      subdelegation,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(SubDelegationFormComponent, modalConfig);
  }

  delete(subdelegation: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        let data = {
          id: subdelegation.id,
          description: subdelegation.description,
          delegationNumber: subdelegation.delegationNumber.id,
          dailyConNumber: subdelegation.dailyConNumber,
          dateDailyCon: subdelegation.dateDailyCon,
          registerNumber: subdelegation.registerNumber,
          phaseEdo: subdelegation.phaseEdo,
        };
        this.delete1(data);
      }
    });
  }
  delete1(data: any) {
    this.subdelegationService.remove(data).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Sub delegacion', 'Borrado Correctamente');
      },
      error: err => {
        this.alert(
          'warning',
          'Sub Delegaciones',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
