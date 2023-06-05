import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { RAsuntDicService } from '../../../../core/services/catalogs/r-asunt-dic.service';
import { RAsuntDicFormComponent } from '../rasunt-dic-form/rasunt-dic-form.component';
import { R_ASUNT_DIC_COLUMNS } from './rasunt-dic-columns';

@Component({
  selector: 'app-rasunt-dic-list',
  templateUrl: './rasunt-dic-list.component.html',
  styles: [],
})
export class RAsuntDicListComponent extends BasePage implements OnInit {
  rAsuntDics: IRAsuntDic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private rAsuntDicService: RAsuntDicService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = R_ASUNT_DIC_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }
  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((change: { action: string; filter: { filters: any } }) => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
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
    this.rAsuntDicService.getAll(params).subscribe({
      next: response => {
        this.rAsuntDics = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(rAsuntDic?: IRAsuntDic) {
    let config: ModalOptions = {
      initialState: {
        rAsuntDic,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(RAsuntDicFormComponent, config);
  }

  delete(rAsuntDic?: IRAsuntDic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.rAsuntDicService.remove(rAsuntDic.code);
      }
    });
  }
}
