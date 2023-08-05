import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IThirdPartyCompany } from 'src/app/core/models/catalogs/third-party-company.model';
import { ThirdPartyService } from 'src/app/core/services/catalogs/third-party-company.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ThirdPartyCompanyFormComponent } from '../third-party-company-form/third-party-company-form.component';
import { THIRDPARTYCOMPANY_COLUMS } from './third-party-company-columns';

@Component({
  selector: 'app-third-party-company-list',
  templateUrl: './third-party-company-list.component.html',
  styles: [],
})
export class ThirdPartyCompanyListComponent extends BasePage implements OnInit {
  thirdPartyCompany: IThirdPartyCompany[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private thirdPartyCompanyService: ThirdPartyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = THIRDPARTYCOMPANY_COLUMS;
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
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'keyCompany':
                searchFilter = SearchFilter.EQ;

                break;
              case 'keyZoneContract':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            console.log(field);
            console.log(searchFilter);

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
    this.thirdPartyCompanyService.getAll(params).subscribe({
      next: response => {
        this.thirdPartyCompany = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(thirdParty?: IThirdPartyCompany) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      thirdParty,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(ThirdPartyCompanyFormComponent, modalConfig);
  }

  showDeleteAlert(thirdPartyCompany: IThirdPartyCompany) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(thirdPartyCompany.id);
      }
    });
  }

  delete(id: number) {
    this.thirdPartyCompanyService.removeThirdPartyCompany(id).subscribe(
      res => {
        this.alert('success', 'Empresa de Terceros', 'Borrada Correctamente');
        this.getDeductives();
      },
      err => {
        this.alert(
          'warning',
          'Empresa de Tercero',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
