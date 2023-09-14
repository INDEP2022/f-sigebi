import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { RAsuntDicService } from 'src/app/core/services/catalogs/r-asunt-dic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalIdentifierUnivDbs } from '../modal-cat-identifier-uni-bds/modal-cat-identifier-uni-dbs.component';
import { IDENTIFIER_DBS_COLUMNS } from './identifier-uni-dbs-columns';

@Component({
  selector: 'app-cat-identifier-uni-dbs',
  templateUrl: './cat-identifier-uni-dbs.component.html',
  styles: [],
})
export class CatIdentifierUniDbsComponent extends BasePage implements OnInit {
  rAsuntDics: IRAsuntDic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private rAsuntDicService: RAsuntDicService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = IDENTIFIER_DBS_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
    // this.settings = {
    //   ...this.settings,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: true,
    //     delete: true,
    //     position: 'right',
    //   },
    //   edit: {
    //     ...this.settings.edit,
    //     saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
    //     cancelButtonContent:
    //       '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
    //     confirmSave: true,
    //   },
    //   add: {
    //     addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
    //     createButtonContent:
    //       '<i class="bx bxs-save me-1 text-success mx-2"></i>',
    //     cancelButtonContent:
    //       '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
    //     confirmCreate: true,
    //   },
    //   mode: 'inline',
    //   hideSubHeader: false,
    //   columns: { ...IDENTIFIER_DBS_COLUMNS },
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
            switch (filter.field) {
              case 'dictumData':
                field = `filter.${filter.field}.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'code':
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
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(rAsuntDic?: IRAsuntDic) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      rAsuntDic,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.BsModalService.show(ModalIdentifierUnivDbs, modalConfig);
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
