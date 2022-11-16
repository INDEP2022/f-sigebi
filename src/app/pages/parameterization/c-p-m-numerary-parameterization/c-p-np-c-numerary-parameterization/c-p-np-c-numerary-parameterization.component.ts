import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalNumeraryParameterizationComponent } from '../modal-numerary-parameterization/modal-numerary-parameterization.component';

@Component({
  selector: 'app-c-p-np-c-numerary-parameterization',
  templateUrl: './c-p-np-c-numerary-parameterization.component.html',
  styles: [],
})
export class CPNpCNumeraryParameterizationComponent
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
        typeAct: {
          title: 'Tipo de Acta o Pantalla',
          sort: false,
        },
        initialCategory: {
          title: 'Categoria Inicial',
          sort: false,
        },
        initialCategoryDescription: {
          title: 'Descripción',
          sort: false,
        },
        finalCategory: {
          title: 'Categoria Final',
          sort: false,
        },
        finalCategoryDescription: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalNumeraryParameterizationComponent>) {
    const modalRef = this.modalService.show(
      ModalNumeraryParameterizationComponent,
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
      typeAct: 'Acta No 1',
      initialCategory: 'Categoria Inicial 1',
      initialCategoryDescription: 'Descripción de la categoria Inicial',
      finalCategory: 'Categoria Final 1',
      finalCategoryDescription: 'Descripción de la categoria Final',
    },
    {
      typeAct: 'Acta No 2',
      initialCategory: 'Categoria Inicial 2',
      initialCategoryDescription: 'Descripción de la categoria Inicial',
      finalCategory: 'Categoria Final 2',
      finalCategoryDescription: 'Descripción de la categoria Final',
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
