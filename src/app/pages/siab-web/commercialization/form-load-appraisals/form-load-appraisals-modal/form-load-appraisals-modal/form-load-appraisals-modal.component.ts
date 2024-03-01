import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AVALUOS_RECH, BIENES_RECH } from './form-load-appraisals-modal-colum';

@Component({
  selector: 'app-form-load-appraisals-modal',
  templateUrl: './form-load-appraisals-modal.component.html',
  styles: [],
})
export class FormLoadAppraisalsModalComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data2: LocalDataSource = new LocalDataSource();
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...BIENES_RECH },
    };
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
      actions: false,
      columns: { ...AVALUOS_RECH },
    };
  }

  ngOnInit(): void {}
}
