import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISiseProcess } from 'src/app/core/models/catalogs/sise-process.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { SiseProcessService } from '../../../../core/services/catalogs/sise-process.service';
import { SiseProcessFormComponent } from '../sise-process-form/sise-process-form.component';
import { SISI_PROCESS_COLUMNS } from './sisi-process-columns';

@Component({
  selector: 'app-sise-process-list',
  templateUrl: './sise-process-list.component.html',
  styles: [],
})
export class SiseProcessListComponent extends BasePage implements OnInit {
  siseProcess: ISiseProcess[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private siseProcessService: SiseProcessService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = SISI_PROCESS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.siseProcessService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.siseProcess = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(sisi?: ISiseProcess) {
    let config: ModalOptions = {
      initialState: {
        sisi,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(SiseProcessFormComponent, config);
  }

  delete(sisi?: ISiseProcess) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.siseProcessService.remove(sisi.id);
      }
    });
  }
}
