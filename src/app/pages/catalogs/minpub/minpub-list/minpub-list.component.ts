import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { IMinpub } from '../../../../core/models/catalogs/minpub.model';
import { MinPubService } from '../../../../core/services/catalogs/minpub.service';
import { MINIPUB_COLUMNS } from './minpub-columns';
import { MinpubFormComponent } from './../minpub-form/minpub-form.component';

@Component({
  selector: 'app-minpub-list',
  templateUrl: './minpub-list.component.html',
  styles: [
  ]
})
export class MinpubListComponent extends BasePage implements OnInit {

  
  columns: IMinpub[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private minpubService: MinPubService,
    private modalService: BsModalService
  ) { 
    super();
    this.settings.columns = MINIPUB_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.minpubService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<MinpubFormComponent>) {
    const modalRef = this.modalService.show(MinpubFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(minpub?: IMinpub) {
    this.openModal({ minpub });
  }

  delete(batch: IMinpub) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
