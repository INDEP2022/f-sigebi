import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DelegationFormComponent } from '../delegation-form/delegation-form.component';
import { DELEGATION_COLUMS } from './delegation-columns';
@Component({
  selector: 'app-delegation-list',
  templateUrl: './delegation-list.component.html',
  styles: [],
})
export class DelegationListComponent extends BasePage implements OnInit {
  paragraphs: IDelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private delegationService: DelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DELEGATION_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  private shouldUseEqualsFilter(field: string): boolean {
    return Object.keys(this.settings.columns).includes(field);
  }

  private applyFilters(change: any) {
    if (change.action === 'filter') {
      const filters = change.filter.filters;
      filters.map((filter: any) => {
        let field = ``;
        let searchFilter = SearchFilter.ILIKE;
        field = `filter.${filter.field}`;
        switch (filter.field) {
          case 'id':
            searchFilter = SearchFilter.EQ;
            break;
          case 'noRegister':
            searchFilter = SearchFilter.EQ;
            break;
          case 'zoneContractKey':
            searchFilter = SearchFilter.EQ;
            break;
          case 'idZoneGeographic':
            searchFilter = SearchFilter.ILIKE;
            //field = `filter.${filter.field}.description`;
            break;
          case 'diffHours':
            searchFilter = SearchFilter.EQ;
            //field = `filter.${filter.field}.description`;
            break;
          case 'etapaEdo':
            searchFilter = SearchFilter.EQ;
            //field = `filter.${filter.field}.description`;
            break;
          case 'zoneVigilanceKey':
            searchFilter = SearchFilter.EQ;
            //field = `filter.${filter.field}.description`;
            break;
          default:
            searchFilter = SearchFilter.ILIKE;
            break;
        }
        if (filter.search !== '') {
          this.columnFilters[field] = `${searchFilter}:${filter.search}`;
        } else {
          delete this.columnFilters[field];
        }
      });
      this.params = this.pageFilter(this.params);
      this.getExample();
    }
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => this.applyFilters(change));

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    //this.settings.pager = { display: true };
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.delegationService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  // openForm(delegation?: any) {
  //   console.log(delegation);
  //   const modalConfig = MODAL_CONFIG;
  //   modalConfig.initialState = {
  //     delegation,
  //     callback: (next: boolean) => {
  //       if (next) this.getExample();
  //     },
  //   };
  //   this.modalService.show(DelegationFormComponent, modalConfig);
  // }
  openForm(delegation?: any) {
    let config: ModalOptions = {
      initialState: {
        delegation,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DelegationFormComponent, config);
  }
  delete(delegation: IDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.delete1(delegation.id, delegation.etapaEdo.toString());
      }
    });
  }
  delete1(id: number, edo: string) {
    this.delegationService.remove2(id, edo).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Delegación', 'Borrado Correctamente');
      },
      error: err => {
        this.alert(
          'warning',
          'Delegaciones',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
