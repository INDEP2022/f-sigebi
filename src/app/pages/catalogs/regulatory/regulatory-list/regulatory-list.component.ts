import { Component, OnInit } from '@angular/core';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { RegulatoryService } from 'src/app/core/services/catalogs/regulatory.service';
import { RegulatoyFormComponent } from '../regulatory-form/regulatoy-form.component';
import { REGULATORY_COLUMNS } from './regulatory-columns';

@Component({
  selector: 'app-regulatory-list',
  templateUrl: './regulatory-list.component.html',
  styles: [],
})
export class RegulatoryListComponent extends BasePage implements OnInit {
  regulatorys: IRegulatory[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private regulatoryService: RegulatoryService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = REGULATORY_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.regulatoryService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.regulatorys = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(regulatory?: IRegulatory) {
    let config: ModalOptions = {
      initialState: {
        regulatory,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(RegulatoyFormComponent, config);
  }

  delete(regulatory?: IRegulatory) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.regulatoryService.remove(regulatory.id);
      }
    });
  }
}
