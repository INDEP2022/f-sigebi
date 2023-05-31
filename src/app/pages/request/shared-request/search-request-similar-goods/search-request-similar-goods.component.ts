import { Component, inject, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//import { AssociateFileButtonComponent } from './associate-file-button/associate-file-button.component';
import { COLUMNS, COLUMNS2 } from './columns';
//Provisional Data
import { RequestService } from 'src/app/core/services/requests/request.service';

@Component({
  selector: 'app-search-request-similar-goods',
  templateUrl: './search-request-similar-goods.component.html',
  styles: [],
})
export class SearchRequestSimilarGoodsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  selectedRows: any = [];

  //Goods Table
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  settings2;

  showDetails: boolean = false;

  /* injections */
  private requestService = inject(RequestService);
  /*  */

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: false,
        delete: false,
        columnTitle: 'Asociar',
        custom: [
          {
            name: 'associate',
            title:
              '<i class="bx bx-link float-icon text-success mx-2 fa-lg"></i>',
          },
        ],
      },
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    //this.data.load(DATA);
  }

  getFormSeach(formSearch: any) {
    this.params.getValue().addFilter('recordId', '$null', SearchFilter.NOT);
    for (const key in formSearch) {
      if (formSearch[key] != null) {
        this.params.getValue().addFilter(key, formSearch[key]);
      }
    }

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getFiles();
    });
  }

  getFiles() {
    const filter = this.params.getValue().getParams(); //.getValue().getFilterParams();
    console.log(filter);
    this.requestService.getAll(filter).subscribe({
      next: resp => {
        console.log(resp.data);
        resp.data.map((item: any) => {
          item['regionalDelegationName'] = item.regionalDelegation
            ? item.regionalDelegation.description
            : '';
          item['stateName'] = item.state ? item.state.descCondition : '';
          item['transferentName'] = item.transferent
            ? item.transferent.name
            : '';
          item['stationName'] = item.emisora ? item.emisora.stationName : '';
          item['authorityName'] = item.authority
            ? item.authority.authorityName
            : '';
        });

        this.data.load(resp.data);
        this.totalItems = resp.count;
      },
    });
    // Llamar servicio para buscar expedientes
    /*let columns = this.data;
    columns.forEach(c => {
      c = Object.assign({ associate: '' }, c);
    });
    this.fileColumns = columns;
    this.totalItems - this.fileColumns.length;
    console.log(this.fileColumns);*/
  }

  onCustom($event: any) {
    if ($event.action === 'associate') {
      this.alertQuestion(
        'question',
        'Asociar',
        'Desea asociar esta solicitud?'
      ).then(question => {
        if (question.isConfirmed) {
          /**
           * CALL SERVICE ()
           * */
          this.data2.load($event.data.goods);
          this.onLoadToast('success', 'Asociada', 'Solicitud Asociada');
        }
      });
    }
  }

  onUserRowSelect($event: any) {
    this.selectedRows = $event.selected;
    this.data2.load($event.data.goods);
    this.showDetails = $event.isSelected ? true : false;
  }

  confirm(result: boolean) {}
}
