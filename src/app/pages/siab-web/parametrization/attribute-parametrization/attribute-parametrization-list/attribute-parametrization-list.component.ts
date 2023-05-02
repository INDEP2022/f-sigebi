import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AttributeParametrizationFormComponent } from '../attribute-parametrization-form/attribute-parametrization-form.component';

@Component({
  selector: 'app-attribute-parametrization-list',
  templateUrl: './attribute-parametrization-list.component.html',
  styles: [],
})
export class AttributeParametrizationListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      column1: {
        title: 'Columna de Información',
        sort: false,
      },
      column2: {
        title: 'Columna Clave Única',
        sort: false,
      },
      column3: {
        title: 'Columna de referencia',
        sort: false,
      },
      column4: {
        title: 'Columna de dato',
        sort: false,
      },
      column5: {
        title: 'DSATRIBUTO',
        sort: false,
      },
      column6: {
        title: 'Tipo de Dato',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(AttributeParametrizationFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
