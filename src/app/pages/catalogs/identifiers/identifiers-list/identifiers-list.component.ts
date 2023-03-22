import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { IDENTIFIER_COLUMNS } from './identifier-columns';

@Component({
  selector: 'app-identifiers-list',
  templateUrl: './identifiers-list.component.html',
  styles: [],
})
export class IdentifiersListComponent extends BasePage implements OnInit {
  paragraphs: IIdentifier[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private identifierService: IdentifierService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...IDENTIFIER_COLUMNS },
    };
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

  openForm(identifier?: IIdentifier) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      identifier,
      callback: (next: boolean) => {
        if (next) this.getIdentifiers();
      },
    };
    this.modalService.show(IdentifierFormComponent, modalConfig);
  }

  //Msj de alerta para borrar identificador
  showDeleteAlert(identifier: IIdentifier) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(identifier);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(identifier: IIdentifier) {
    this.identifierService.remove(identifier.id).subscribe({
      next: data => this.getIdentifiers(),
      error: error => (this.loading = false),
    });
  }
}
