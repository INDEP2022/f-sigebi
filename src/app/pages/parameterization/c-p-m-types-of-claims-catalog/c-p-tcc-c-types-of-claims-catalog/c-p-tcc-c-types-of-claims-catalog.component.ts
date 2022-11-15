import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalTypeOfClaimsComponent } from '../modal-type-of-claims/modal-type-of-claims.component';

@Component({
  selector: 'app-c-p-tcc-c-types-of-claims-catalog',
  templateUrl: './c-p-tcc-c-types-of-claims-catalog.component.html',
  styles: [],
})
export class CPTccCTypesOfClaimsCatalogComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
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
  }

  openModal(context?: Partial<ModalTypeOfClaimsComponent>) {
    const modalRef = this.modalService.show(ModalTypeOfClaimsComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
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

  data = [
    {
      keyClaims: 'DRR',
      description: 'DESCRIPCION DEL SINIESTRO',
    },
    {
      keyClaims: 'DRR',
      description: 'DESCRIPCION DEL SINIESTRO 2',
    },
  ];

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Eliminado correctamente', '');
      }
    });
  }
}
