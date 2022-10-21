import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MonitorUnavoidableAssetsParametersComponent } from '../monitor-unavoidable-assets-parameters/monitor-unavoidable-assets-parameters.component';
import { MONITORUNAVOIDABLEASSETS_COLUMNS } from './monitor-unavoidable-assets-columns';

@Component({
  selector: 'app-monitor-unavoidable-assets',
  templateUrl: './monitor-unavoidable-assets.component.html',
  styles: [],
})
export class MonitorUnavoidableAssetsComponent
  extends BasePage
  implements OnInit
{
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = MONITORUNAVOIDABLEASSETS_COLUMNS;
  }

  ngOnInit(): void {}

  openForm(parameters: any) {
    let config: ModalOptions = {
      initialState: {
        parameters,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MonitorUnavoidableAssetsParametersComponent, config);
  }
}
