import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LabelOkeyFormComponent } from '../label-okey-form/label-okey-form.component';
import { LABEL_OKEY_COLUMNS } from './label-okey-columns';

@Component({
  selector: 'app-label-okey-list',
  templateUrl: './label-okey-list.component.html',
  styles: [],
})
export class LabelOkeyListComponent extends BasePage implements OnInit {
  paragraphs: ILabelOKey[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private labelOkeyService: LabelOkeyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LABEL_OKEY_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLabelsOkey());
  }

  getLabelsOkey() {
    this.loading = true;
    this.labelOkeyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(labelOKey?: ILabelOKey) {
    let config: ModalOptions = {
      initialState: {
        labelOKey,
        callback: (next: boolean) => {
          if (next) this.getLabelsOkey();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LabelOkeyFormComponent, config);
  }

  delete(labelOKey: ILabelOKey) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.labelOkeyService.remove(labelOKey.id).subscribe({
          next: data => this.getLabelsOkey(),
          error: error => (this.loading = false),
        });
      }
    });
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalService.hide();
  }
}
