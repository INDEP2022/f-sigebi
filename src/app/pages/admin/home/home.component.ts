import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { ExampleModalComponent } from './example-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent extends BasePage implements OnInit {
  formExample: FormGroup;
  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.formExample = this.fb.group({
      input: [null, [Validators.required]],
      textarea: [null, [Validators.required]],
      select: [null, [Validators.required]],
      radio: ['dog'],
      check: [false],
    });
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        title:'Nuevo Modal'
      }, //pasar datos por aca
      class: 'modal-sm', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalRef = this.modalService.show(ExampleModalComponent, config);
  }
}
