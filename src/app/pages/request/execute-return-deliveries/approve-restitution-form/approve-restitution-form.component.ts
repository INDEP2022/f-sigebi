import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PhotographyFormComponent } from '../../shared-request/photography-form/photography-form.component';
import { APPROVE_RESTITUTION_COLUMNS } from './approve-restitution-columns';

@Component({
  selector: 'app-approve-restitution-form',
  templateUrl: './approve-restitution-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class ApproveRestitutionFormComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paragraphs: any[] = [];
  showSearchForm: boolean = true;
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: APPROVE_RESTITUTION_COLUMNS,
    };
  }

  ngOnInit(): void {}

  selectItem(event: Event) {}

  photographs() {
    const photographs = this.modalService.show(PhotographyFormComponent, {
      class: 'modal-lg modal-centered',
      ignoreBackdropClick: true,
    });
  }

  save() {
    this.alert(
      'question',
      'confirmar',
      '¿Desea enviar la aprobación de bienes en especie para la programación con folio 56564?'
    );
  }
}
