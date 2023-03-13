import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalTypeOfClaimsComponent } from '../modal-type-of-claims/modal-type-of-claims.component';
import { TypesOfClaimsService } from '../types-of-claims.service';

@Component({
  selector: 'app-types-of-claims-catalog',
  templateUrl: './types-of-claims-catalog.component.html',
  styles: [],
})
export class TypesOfClaimsCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  dataTable: LocalDataSource = new LocalDataSource();

  data: any = [];

  constructor(
    private modalService: BsModalService,
    private claimServices: TypesOfClaimsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: {
        keyClaims: {
          title: 'Cve Siniestro',
          sort: false,
        },
        description: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
    this.getClaims();
  }

  getClaims() {
    this.data = [];
    this.claimServices.getClaims().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              keyClaims: item.flag,
              description: item.description,
              id: item.id,
            });
            this.dataTable.load(this.data);
          });
        }
      },
    });
  }

  openModal(context?: Partial<ModalTypeOfClaimsComponent>) {
    const modalRef = this.modalService.show(ModalTypeOfClaimsComponent, {
      initialState: { ...context, lengthData: this.data.length + 1 },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getClaims();
      }
    });
  }

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  delete(event: any) {
    console.log(event);
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.claimServices.deleteClaims(event.id).subscribe({
          next: (resp: any) => {
            this.onLoadToast('success', 'Eliminado correctamente', '');
            this.getClaims();
          },
        });
      }
    });
  }
}
