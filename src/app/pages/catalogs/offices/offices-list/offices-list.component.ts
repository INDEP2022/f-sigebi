import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOffice } from 'src/app/core/models/catalogs/office.model';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { OfficeFormComponent } from '../office-form/office-form.component';
import { OFFICES_COLUMNS } from './offices-columns';

@Component({
  selector: 'app-offices-list',
  templateUrl: './offices-list.component.html',
  styles: [],
})
export class OfficesListComponent extends BasePage implements OnInit {
  offices: IOffice[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private officeService: OfficeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = OFFICES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.officeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.offices = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(office?: IOffice) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      office,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(OfficeFormComponent, modalConfig);
  }

  showDeleteAlert(office: IOffice) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(office.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.officeService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}
