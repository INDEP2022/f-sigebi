import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IServiceGood } from 'src/app/core/models/ms-good/good';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { ServiceGoodService } from 'src/app/core/services/ms-serviceGood/servicegood.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-service',
  templateUrl: './register-service.component.html',
  styles: [],
})
export class RegisterServiceComponent extends BasePage implements OnInit {
  form: ModelForm<any>;
  goodId: number;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly serviceGoodService: ServiceGoodService,
    private readonly catService: ServiceCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      service: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateCourt: [null, [Validators.required]],
      periodicity: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    const model: IServiceGood = {
      cveService: this.form.get('service').value,
      dateCourt: this.form.get('dateCourt').value,
      goodNumber: this.goodId,
      periodicity: this.form.get('periodicity').value,
    };
    console.log(model);
    this.serviceGoodService.create(model).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: err => {
        console.log(err);
        this.alert(
          'error',
          'Regitro de Servicio',
          'No se Pudo Guardar el Servicio'
        );
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro de Servicio', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
