import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCatAppraisersComponent } from '../modal-cost-catalog/modal-cat-appraisers.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cat-appraisers',
  templateUrl: './cat-appraisers.component.html',
  styles: [],
})
export class CatAppraisersComponent extends BasePage implements OnInit {
  columns: any[] = [];
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [
    {
      noAppraisers: '1',
      name: 'Juan de Dios Ortega',
      charge: 'Administrador',
    },
    {
      noAppraisers: '2',
      name: 'Mayra Fernanda Lucio',
      charge: 'Contadora',
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.getPagination();
    this.searchParams();
  }

  searchParams() {}

  getCostCatalog() {}

  openModal(context?: Partial<ModalCatAppraisersComponent>) {
    const modalRef = this.modalService.show(ModalCatAppraisersComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getCostCatalog();
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  // getData() {
  //   this.loading = true;
  //   this.columns = this.data;
  //   this.totalItems = this.data.length;
  //   this.loading = false;
  // }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  getDrawers() {
    this.loading = true;
  }

  delete(drawer: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }
}
