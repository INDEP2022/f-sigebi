import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalIndiciaRegistrationComponent } from '../modal-indicia-registration/modal-indicia-registration.component';

@Component({
  selector: 'app-indicia-registration',
  templateUrl: './indicia-registration.component.html',
  styles: [],
})
export class IndiciaRegistrationComponent extends BasePage implements OnInit {
  paragraphs: IIndiciados[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private indicatedService: IndiciadosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: {
        id: {
          title: 'Número indiciado',
          type: 'number',
          sort: false,
        },
        name: {
          title: 'Nombre',
          type: 'string',
          sort: false,
        },
        noRegistration: {
          title: 'Número de registro',
          type: 'number',
          sort: false,
        },
        curp: {
          title: 'Curp',
          type: 'string',
          sort: false,
        },
        consecutive: {
          title: 'Consecutivo',
          type: 'number',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIndicated());
  }

  getIndicated() {
    this.loading = true;
    this.indicatedService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  public openForm(indicated?: IIndiciados) {
    let config: ModalOptions = {
      initialState: {
        indicated,
        callback: (next: boolean) => {
          if (next) this.getIndicated();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalIndiciaRegistrationComponent, config);
  }

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
