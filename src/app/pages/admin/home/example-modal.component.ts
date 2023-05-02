import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalNestedComponent } from './modal-nest.component';

@Component({
  template: `
    <app-modal>
      <div header>
        <h5 class="modal-title">{{ parentModal }}</h5>
      </div>
      <div body>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil
          perspiciatis in impedit sunt officia aspernatur quam consequatur qui,
          aperiam, natus ratione! Maiores dolorum magnam et accusantium
          assumenda. Autem, enim optio.
        </p>
      </div>
      <div footer>
        <div class="d-flex justify-content-center">
          <div class="m-3">
            <button
              type="button"
              class="btn btn-primary active"
              (click)="openModal()">
              Child Modal
            </button>
          </div>
          <div class="m-3">
            <button
              type="button"
              class="btn btn-danger active"
              (click)="close()">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </app-modal>
  `,
})
export class ExampleModalComponent extends BasePage {
  parentModal: string;
  childModal: BsModalRef;
  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        dataChild: 'Modal Hijo',
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-sm', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.childModal = this.modalService.show(ModalNestedComponent, config);
  }
  close() {
    this.bsModalRef.content.callback({ editado: true });
    this.bsModalRef.hide();
  }
}
