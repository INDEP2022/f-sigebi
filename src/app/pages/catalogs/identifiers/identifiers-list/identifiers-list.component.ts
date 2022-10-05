import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { IDENTIFIER_COLUMNS } from './identifier-columns';

@Component({
  selector: 'app-identifiers-list',
  templateUrl: './identifiers-list.component.html',
  styles: [],
})
export class IdentifiersListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  paragraphs: IIdentifier[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private identifierService: IdentifierService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = IDENTIFIER_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIdentifiers());
  }

  getIdentifiers() {
    this.loading = true;
    this.identifierService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<IdentifierFormComponent>) {
    const modalRef = this.modalService.show(IdentifierFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getIdentifiers();
    });
  }

  openForm(identifier?: IIdentifier) {
    this.openModal({ identifier });
  }

  delete(identifier: IIdentifier) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.identifierService.remove(identifier.code).subscribe({
          next: data => this.getIdentifiers(),
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
