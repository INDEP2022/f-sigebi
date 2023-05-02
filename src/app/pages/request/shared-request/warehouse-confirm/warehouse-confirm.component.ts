import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-warehouse-confirm',
  templateUrl: './warehouse-confirm.component.html',
  styles: [],
})
export class WarehouseConfirmComponent extends BasePage implements OnInit {
  responseForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.responseForm = this.fb.group({
      idWarehouse: [null, [Validators.required]],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea confirmar el alta de almacén?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Alta de almacén confirmada correctamente',
          ''
        );
        this.close();
      }
    });
  }

  close() {
    this.modalService.hide();
  }
}
