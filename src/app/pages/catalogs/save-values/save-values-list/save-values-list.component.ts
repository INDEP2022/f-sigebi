import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SaveValueFormComponent } from '../save-value-form/save-value-form.component';
import { SAVE_VALUES_COLUMNS } from './save-values-columns';

@Component({
  selector: 'app-save-values-list',
  templateUrl: './save-values-list.component.html',
  styles: [],
})
export class SaveValuesListComponent extends BasePage implements OnInit {
  paragraphs: ISaveValue[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private saveValueService: SaveValueService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAVE_VALUES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSaveValues());
  }

  getSaveValues() {
    this.loading = true;
    this.saveValueService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(saveValue?: ISaveValue) {
    let config: ModalOptions = {
      initialState: {
        saveValue,
        callback: (next: boolean) => {
          if (next) this.getSaveValues();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SaveValueFormComponent, config);
  }

  delete(saveValue: ISaveValue) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.saveValueService.remove(saveValue.id).subscribe({
          next: data => this.getSaveValues(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
