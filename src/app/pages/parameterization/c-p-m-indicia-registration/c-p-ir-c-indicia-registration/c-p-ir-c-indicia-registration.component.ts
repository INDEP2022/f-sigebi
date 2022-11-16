import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalIndiciaRegistrationComponent } from '../modal-indicia-registration/modal-indicia-registration.component';

@Component({
  selector: 'app-c-p-ir-c-indicia-registration',
  templateUrl: './c-p-ir-c-indicia-registration.component.html',
  styles: [],
})
export class CPIrCIndiciaRegistrationComponent
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
        numberIndiciado: {
          title: 'No Indiciado',
          sort: false,
        },
        name: {
          title: 'Nombre',
          sort: false,
        },
        curp: {
          title: 'Curp',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  openModal(context?: Partial<ModalIndiciaRegistrationComponent>) {
    const modalRef = this.modalService.show(ModalIndiciaRegistrationComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
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
      numberIndiciado: '1',
      name: 'INDICIADO NUMERO 1',
      curp: 'CURP_N',
    },
    {
      numberIndiciado: '2',
      name: 'INDICIADO NUMERO 2',
      curp: 'CURP_N2',
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
