import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILawyer } from 'src/app/core/models/catalogs/lawyer.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';
import { LawyerDetailComponent } from '../lawyer-detail/lawyer-detail.component';
import { LAWYER_COLUMNS } from './lawyer-columns';

@Component({
  selector: 'app-lawyer-list',
  templateUrl: './lawyer-list.component.html',
  styles: [],
})
export class LawyerListComponent extends BasePage implements OnInit {
  lawyers: ILawyer[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private lawyerService: LawyerService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LAWYER_COLUMNS;
    //this.settings.actions.delete = true;
    //this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
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
            /*filter.field == 'id' ||
              filter.field == 'office' ||
              filter.field == 'name' ||
              filter.field == 'street' ||
              filter.field == 'streetNumber' ||
              filter.field == 'apartmentNumber' ||
              filter.field == 'suburb' ||
              filter.field == 'delegation' ||
              filter.field == 'zipCode' ||
              filter.field == 'rfc' ||
              filter.field == 'phone'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'officeDetails':
                field = `filter.${filter.field}.name`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'name':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'street':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'streetNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'apartmentNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'suburb':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'delegation':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
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
          this.getLawyers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLawyers());
  }

  getLawyers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.lawyerService.getAllDetail(params).subscribe({
      next: response => {
        console.log(response.data);
        //this.lawyers = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(lawyer?: ILawyer) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      lawyer,
      callback: (next: boolean) => {
        if (next) this.getLawyers();
      },
    };
    this.modalService.show(LawyerDetailComponent, modalConfig);
  }

  cleanCreate() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLawyers());
  }

  showDeleteAlert(lawyer: ILawyer) {
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
    this.lawyerService.remove(id).subscribe({
      next: () => {
        this.getLawyers(),
          this.alert('success', 'Abogado', 'Borrado Correctemente');
      },
    });
  }
}
