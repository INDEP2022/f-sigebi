import { Component, OnInit } from '@angular/core';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IResponseRepuve } from 'src/app/core/models/catalogs/response-repuve.model';
import { ResponseRepuveService } from 'src/app/core/services/catalogs/response-repuve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ResponseRepuveFormComponent } from '../response-repuve-form/response-repuve-form.component';
import { RESPONSE_REPUVE_COLUMNS } from './response-repuve-columns';

@Component({
  selector: 'app-response-repuve-list',
  templateUrl: './response-repuve-list.component.html',
  styles: [],
})
export class ResponseRepuveListComponent extends BasePage implements OnInit {
  responseRepuves: IResponseRepuve[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private responseRepuveService: ResponseRepuveService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = RESPONSE_REPUVE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.responseRepuveService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.responseRepuves = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(responseRepuve?: IResponseRepuve) {
    let config: ModalOptions = {
      initialState: {
        responseRepuve,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(ResponseRepuveFormComponent, config);
  }

  delete(responseRepuve?: IResponseRepuve) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.responseRepuveService.remove(responseRepuve.id);
      }
    });
  }
}
