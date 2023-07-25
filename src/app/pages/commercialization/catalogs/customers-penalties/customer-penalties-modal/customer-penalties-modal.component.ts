import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-customer-penalties-modal',
  templateUrl: './customer-penalties-modal.component.html',
  styles: [],
})
export class CustomerPenaltiesModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Penalización y Cambio de Estatus';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  customersPenalties: ICustomersPenalties;
  penalty: any; //IPenalty
  penalties: ICustomersPenalties;
  today: Date;

  @Output() data = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private clientPenaltyService: ClientPenaltyService,
    private modalRef: BsModalRef
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.penalties);
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeProcess: [null],
      event: [null],
      eventKey: [null],
      lotId: [null],
      startDate: [null],
      endDate: [null],
      refeOfficeOther: [null],
      userPenalty: [null],
      penaltiDate: [null],
    });
    if (this.customersPenalties != null) {
      this.edit = true;
      this.form.patchValue(this.customersPenalties);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    this.clientPenaltyService
      .updateCustomers(this.customersPenalties.clientId.id, this.form.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: (error: any) => {
          this.alert('warning', `${error.error.message}`, '');
          this.loading = false;
        },
      });
  }

  create() {
    this.loading = true;
    if (this.form.valid) {
      this.clientPenaltyService.create(this.form.value).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert(
            'warning',
            `No es Posible Crear el Cliente: ${error.error.message}`,
            ''
          );
          this.loading = false;
        },
      });
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'Penalización Actualizada'
      : 'Penalización Creadoa';
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
