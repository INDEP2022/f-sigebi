import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComerSaleStatusService } from 'src/app/core/services/ms-event/comer-sale-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sale-status-form',
  templateUrl: './sale-status-form.component.html',
  styles: [],
})
export class SaleStatusFormComponent extends BasePage implements OnInit {
  status: string = 'Nuevo';
  edit: boolean = false;
  title: string = 'ESTATUS DE VENTA';
  form: FormGroup = new FormGroup({});
  saleStatus: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private saleStatusService: ComerSaleStatusService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4),
        ],
      ],
    });

    if (this.saleStatus) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.edit = true;
      this.form.patchValue(this.saleStatus);
      this.form.controls['id'].disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.saleStatusService
      .checkExistingId(this.form.controls['id'].value)
      .subscribe({
        next: response => {
          console.log(response);
          if (response) {
            this.loading = false;
            this.onLoadToast(
              'error',
              'Estatus No Válido',
              'El estatus ingresado ya existe'
            );
          } else {
            this.saleStatusService.create(this.form.getRawValue()).subscribe({
              next: response => {
                this.loading = false;
                this.handleSuccess();
              },
              error: () => {
                this.loading = false;
                this.onLoadToast(
                  'error',
                  'Error al conectar con el servidor',
                  ''
                );
              },
            });
          }
        },
      });
    this.handleSuccess();
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.saleStatusService
      .update(this.form.controls['id'].value, this.form.getRawValue())
      .subscribe({
        next: response => {
          this.handleSuccess();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.onLoadToast('error', 'Error al conectar con el servidor', '');
        },
      });
  }
}
