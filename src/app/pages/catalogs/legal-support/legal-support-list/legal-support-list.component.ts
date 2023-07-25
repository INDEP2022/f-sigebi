import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILegalSupport } from 'src/app/core/models/catalogs/legal-suport.model';
import { LegalSupportService } from 'src/app/core/services/catalogs/legal-suport.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LegalSupportFormComponent } from '../legal-support-form/legal-support-form.component';
import { LEGAL_SUPPORT_COLUMS } from './legal-support-columns';

@Component({
  selector: 'app-legal-support-list',
  templateUrl: './legal-support-list.component.html',
  styles: [],
})
export class LegalSupportListComponent extends BasePage implements OnInit {
  paragraphs: ILegalSupport[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private legalSupportService: LegalSupportService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LEGAL_SUPPORT_COLUMS;
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
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'doctoTypeId':
                //field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log('this.param:', this.params);
              this.params.value.page = 1;
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
    this.legalSupportService.getAll(params).subscribe({
      next: response => {
        /*this.paragraphs = response.data.map((item: any) => {
          item.id = item.doctoTypeId?.id || '';
          return item;
        });*/
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  openForm(legalSupport?: ILegalSupport) {
    let config: ModalOptions = {
      initialState: {
        legalSupport,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LegalSupportFormComponent, config);
  }

  delete(legalSupport: ILegalSupport) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(legalSupport.doctoTypeId);
      }
    });
  }

  remove(id: string) {
    this.legalSupportService.remove(id).subscribe({
      next: resp => {
        this.alert('success', 'Sustento Legal', 'Borrado Correctamente');
        this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Sustento Legal',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
