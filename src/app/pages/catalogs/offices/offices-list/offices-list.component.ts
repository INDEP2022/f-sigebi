import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IOffice } from 'src/app/core/models/catalogs/office.model';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { OfficeFormComponent } from '../office-form/office-form.component';
import { OFFICES_COLUMNS } from './offices-columns';

@Component({
  selector: 'app-offices-list',
  templateUrl: './offices-list.component.html',
  styles: [],
})
export class OfficesListComponent extends BasePage implements OnInit {
  offices: IOffice[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private officeService: OfficeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = OFFICES_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'name':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'street':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noExt':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'postalCode':
                searchFilter = SearchFilter.EQ;
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

          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.officeService.getAllGet(params).subscribe({
      next: response => {
        this.offices = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(office?: IOffice) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      office,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(OfficeFormComponent, modalConfig);
  }

  showDeleteAlert(office: IOffice) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(office.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.officeService.remove(id).subscribe({
      next: () => {
        this.getDeductives();
        this.alert('success', 'Despacho', 'Borrado Correctamente');
      },
    });
  }
}
