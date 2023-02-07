import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegulationFormComponent } from '../regulation-form/regulation-form.component';

@Component({
  selector: 'app-regulations-list',
  templateUrl: './regulations-list.component.html',
  styles: [],
})
export class RegulationsListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = {
      capitulo: {
        title: 'Regulación',
        sort: false,
      },
      column2: {
        title: 'Mercancía que regula',
        sort: false,
      },
      column3: {
        title: 'Fundamento Jurídico',
        sort: false,
      },
      column4: {
        title: 'Objetivo',
        sort: false,
      },
      column5: {
        title: 'Características Relevantes',
        sort: false,
      },
      column6: {
        title: 'Tipo',
        sort: false,
      },
      column7: {
        title: 'Condición',
        sort: false,
      },
      column8: {
        title: 'Destino',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}

  add() {
    this.modalService.show(RegulationFormComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }
  edit(row: any) {}
}
