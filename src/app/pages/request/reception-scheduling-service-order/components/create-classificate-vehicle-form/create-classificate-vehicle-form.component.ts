import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICatGeneric } from 'src/app/common/repository/interfaces/cat-generic.interface';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IServiceVehicle } from 'src/app/core/models/ms-order-service/order-service-vehicle.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-create-classificate-vehicle-form',
  templateUrl: './create-classificate-vehicle-form.component.html',
  styles: [],
})
export class CreateClassificateVehicleFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  item: any;
  title: string = 'Clasificación de vehiculos';
  edit: boolean = false;
  orderServiceId: number = 0;
  typeVehicle = new DefaultSelect<ICatGeneric>();
  event: EventEmitter<any> = new EventEmitter();
  serviceVehicleData: IServiceVehicle;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService,
    private orderService: OrderServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTypeVehicle(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      orderServiceId: [this.orderServiceId],
      id: [null, [Validators.required]],
      amountSale: [null, [Validators.pattern(STRING_PATTERN)]],
      amountDonation: [null, [Validators.pattern(STRING_PATTERN)]],
      amountDestruction: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.serviceVehicleData) {
      this.edit = true;
      this.form.patchValue(this.serviceVehicleData);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea editar una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        const idTypeVehicle = this.serviceVehicleData.id;
        const orderServiceId = this.serviceVehicleData.orderServiceId;

        this.orderService
          .updateServiceVehicle(idTypeVehicle, orderServiceId, this.form.value)
          .subscribe({
            next: response => {
              this.onLoadToast(
                'success',
                'Correcto',
                'Clasificación de vehiculos actualizada correctamente'
              );
              this.modalRef.content.callback(true);
              this.modalRef.hide();
            },
            error: error => {},
          });
        //Ejecutar servicio
        /*
        this.close(); */
      }
    });
  }
  create() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea crear una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        this.orderService.postServiceVehicle(this.form.value).subscribe({
          next: response => {
            this.alert(
              'success',
              'Correcto',
              'Clasificación de Vehiculos creada correctamente'
            );
            this.modalRef.content.callback(true);
            this.close();
          },
          error: error => {},
        });
        //this.onLoadToast('success', 'Clasificación creada correctamente', '');
        //this.modalRef.content.callback(this.form.value);
        //this.event.emit(this.form.value);
        //this.close();
      }
    });
  }

  getTypeVehicle(params: ListParams) {
    params['filter.name'] = 'Tipo Vehiculo';
    this.genericService.getAll(params).subscribe({
      next: response => {
        this.typeVehicle = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  close() {
    this.modalRef.hide();
  }
}
