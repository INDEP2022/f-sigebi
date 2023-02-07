import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCatalogOfTransferorsComponent } from '../modal-catalog-of-transferors/modal-catalog-of-transferors.component';

@Component({
  selector: 'app-c-p-ct-c-catalog-of-transferors',
  templateUrl: './c-p-ct-c-catalog-of-transferors.component.html',
  styles: [],
})
export class CPCtCCatalogOfTransferorsComponent
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
        number: {
          title: 'Numero',
          sort: false,
        },
        name: {
          title: 'Nombre',
          sort: false,
        },
        key: {
          title: 'Clave',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalCatalogOfTransferorsComponent>) {
    const modalRef = this.modalService.show(
      ModalCatalogOfTransferorsComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getData();
        this.onLoadToast('success', 'Guardado Correctamente', '');
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

  data = [
    {
      number: '3',
      name: '2022',
      key: 1,
    },
    {
      number: '2',
      name: '2022',
      key: 2,
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
