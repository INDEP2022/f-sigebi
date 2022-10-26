import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ClarificationFormTabComponent } from '../clarification-form-tab/clarification-form-tab.component';
import { CLARIFICATION_COLUMNS } from './clarification-columns';

var data = [
  {
    id: 1,
    clarificationDate: '25/10/2022',
    typeClarification: 'Aclaración',
    clarification: 'ACLARACION EN DESCRIPCION DE BIEN',
    reason: 'PRUEBAS',
    status: 'NUEVA ACLARACION',
    observations: '',
  },
  {
    id: 2,
    clarificationDate: '25/10/2022',
    typeClarification: 'Aclaración',
    clarification: 'ACLARACION EN DESCRIPCION DE BIEN',
    reason: 'PRUEBAS',
    status: 'NUEVA ACLARACION',
    observations: '',
  },
];

@Component({
  selector: 'app-clarification-list-tab',
  templateUrl: './clarification-list-tab.component.html',
  styles: [],
})
export class ClarificationListTabComponent extends BasePage implements OnInit {
  @Input() detailAssets: any;
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      columns: CLARIFICATION_COLUMNS,
    };
    this.settings.actions.delete = true;

    console.log(this.detailAssets);
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    this.loading = true;
    this.paragraphs = data;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
    /* this.goodTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        console.log(this.paragraphs);
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }

  openForm(event?: any): void {
    let docClarification = event;
    let config: ModalOptions = {
      initialState: {
        docClarification: docClarification,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClarificationFormTabComponent, config);
  }

  showDeleteAlert(event: any): any {}
}
