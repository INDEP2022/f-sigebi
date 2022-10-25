import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocRequestTabComponent } from '../doc-request-tab/doc-request-tab.component';
import { GOOD_DOCUMENTES_COLUMNS } from './good-doc-columns';

@Component({
  selector: 'app-good-doc-tab',
  templateUrl: './good-doc-tab.component.html',
  styles: [],
})
export class GoodDocTabComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any = [];
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = GOOD_DOCUMENTES_COLUMNS;
  }

  ngOnInit(): void {
    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample()); */
  }

  getExample() {
    /* this.loading = true;
    this.goodTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        console.log(this.paragraphs);
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }

  selectTableColumns(event: any): void {
    console.log(event);
  }

  showDocuments(): void {
    //console.log('mostrar los documentos seleccionados');
    let config: ModalOptions = {
      initialState: {
        parameter: '',
        type: 'good',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: `modalSizeXL modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocRequestTabComponent, config);
  }
}
