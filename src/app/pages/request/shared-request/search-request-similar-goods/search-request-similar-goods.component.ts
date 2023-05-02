import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//import { AssociateFileButtonComponent } from './associate-file-button/associate-file-button.component';
import { COLUMNS, COLUMNS2 } from './columns';
//Provisional Data
import { DATA } from './data';

@Component({
  selector: 'app-search-request-similar-goods',
  templateUrl: './search-request-similar-goods.component.html',
  styles: [],
})
export class SearchRequestSimilarGoodsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  selectedRows: any = [];

  //Goods Table
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  settings2;

  showDetails: boolean = false;

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
    this.data.load(DATA);
  }

  /*getFiles(requestInfo: any) {
    console.log(requestInfo);
    // Llamar servicio para buscar expedientes
    let columns = this.data;
    columns.forEach(c => {
      c = Object.assign({ associate: '' }, c);
    });
    this.fileColumns = columns;
    this.totalItems - this.fileColumns.length;
    console.log(this.fileColumns);
  }*/

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
