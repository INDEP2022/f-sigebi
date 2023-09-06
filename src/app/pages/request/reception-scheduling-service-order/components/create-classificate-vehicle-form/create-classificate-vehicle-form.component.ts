import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICatGeneric } from 'src/app/common/repository/interfaces/cat-generic.interface';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
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
  typeVehicle = new DefaultSelect<ICatGeneric>();
  event: EventEmitter<any> = new EventEmitter();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTypeVehicle(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      typeVehicle: [null, [Validators.required]],
      sale: [null, [Validators.pattern(STRING_PATTERN)]],
      donation: [null, [Validators.pattern(STRING_PATTERN)]],
      destruction: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.item != null) {
      this.edit = true;
      this.form.patchValue(this.item);
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
        //Ejecutar servicio
        this.onLoadToast('success', 'Clasificación editada correctamente', '');
        this.modalRef.content.callback(this.form.value);
        this.close();
      }
    });
  }
  create() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea crear una clasificación de vehiculos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar servicio
        this.onLoadToast('success', 'Clasificación creada correctamente', '');
        //this.modalRef.content.callback(this.form.value);
        this.event.emit(this.form.value);
        this.close();
      }
    });
  }

  getTypeVehicle(params: ListParams) {
    params['filter.name'] = 'Tipo Vehiculo';
    this.genericService.getAll(params).subscribe({
      next: response => {
        console.log('response', response);
        this.typeVehicle = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  close() {
    this.modalRef.hide();
  }
}
