import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { RackService } from 'src/app/core/services/catalogs/rack.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRack } from '../../../../core/models/catalogs/rack.model';
import { RackFormComponent } from '../rack-form/rack-form.component';
import { RACK_COLUMNS } from './rack-columns';

@Component({
  selector: 'app-rack-list',
  templateUrl: './rack-list.component.html',
  styles: [],
})
export class RackListComponent extends BasePage implements OnInit {
  racks: IRack[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private rackService: RackService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = RACK_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.rackService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.racks = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(rack?: IRack) {
    let config: ModalOptions = {
      initialState: {
        rack,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(RackFormComponent, config);
  }

  delete(rack?: IRack) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.rackService.remove(rack.id);
      }
    });
  }
}
