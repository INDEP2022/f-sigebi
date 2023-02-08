import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FractionWithClassifierFormComponent } from '../fraction-with-classifier-form/fraction-with-classifier-form.component';
@Component({
  selector: 'app-fraction-with-classifier-list',
  templateUrl: './fraction-with-classifier-list.component.html',
  styles: [],
})
export class FractionWithClassifierListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      column1: {
        title: 'Capitulo',
        sort: false,
      },
      column2: {
        title: 'Partida',
        sort: false,
      },
      column3: {
        title: 'Subpartida',
        sort: false,
      },
      column4: {
        title: 'SubSubpartida',
        sort: false,
      },
      column5: {
        title: 'Clasificador SIAB',
        sort: false,
      },
      column6: {
        title: 'Unidad',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(FractionWithClassifierFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
