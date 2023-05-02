import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRAsuntDic } from 'src/app/core/models/catalogs/r-asunt-dic.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { RAsuntDicService } from '../../../../core/services/catalogs/r-asunt-dic.service';
import { RAsuntDicFormComponent } from '../rasunt-dic-form/rasunt-dic-form.component';
import { R_ASUNT_DIC_COLUMNS } from './rasunt-dic-columns';

@Component({
  selector: 'app-rasunt-dic-list',
  templateUrl: './rasunt-dic-list.component.html',
  styles: [],
})
export class RAsuntDicListComponent extends BasePage implements OnInit {
  rAsuntDics: IRAsuntDic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private rAsuntDicService: RAsuntDicService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = R_ASUNT_DIC_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.rAsuntDicService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.rAsuntDics = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(rAsuntDic?: IRAsuntDic) {
    let config: ModalOptions = {
      initialState: {
        rAsuntDic,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(RAsuntDicFormComponent, config);
  }

  delete(rAsuntDic?: IRAsuntDic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.rAsuntDicService.remove(rAsuntDic.code);
      }
    });
  }
}
