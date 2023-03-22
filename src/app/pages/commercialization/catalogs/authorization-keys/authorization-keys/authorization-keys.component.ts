import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
//Services
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';

@Component({
  selector: 'app-authorization-keys',
  templateUrl: './authorization-keys.component.html',
  styles: [],
})
export class AuthorizationKeysComponent extends BasePage implements OnInit {
  eventForm: ModelForm<IComerEvent>;
  event1: IComerEvent;
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private utilComerV1Service: UtilComerV1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
  }

  private prepareForm() {
    this.eventForm = this.fb.group({
      id: [null, [Validators.required]],
      processKey: [null, []],
      observations: [null, []],
    });
  }

  private prepareForm2() {
    this.form = this.fb.group({
      txtEncrip: [null, []],
      encrip: [null, []],
    });
  }

  getEventById(): void {
    let _id = this.eventForm.controls['id'].value;
    console.log(_id);
    this.loading = true;
    this.comerEventosService.getById2(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.eventForm.patchValue(response.data[0]['id']);
          this.eventForm.updateValueAndValidity();
          let key = this.eventForm.controls['id'].value;
          this.form.controls['txtEncrip'].setValue(key);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  generateKey(): void {
    let key = this.eventForm.controls['id'].value;
    this.form.controls['txtEncrip'].setValue(key);
    console.log(key);
    this.loading = true;
    this.utilComerV1Service.encrypt(this.form.value).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          console.log(response);
          this.form.controls['encrip'].setValue(response);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
    /*this.utilComerV1Service.encrypt(this.form.value).subscribe({
      next: data => this.onLoadToast('success', 'Solicitud finalizada con éxito', ''),
      error: error => (this.loading = false),
    })*/
  }

  copy() {
    navigator.clipboard.writeText(this.form.value['encrip']);
    this.onLoadToast(
      'success',
      'Clave de autorización',
      'copiada al portapapeles'
    );
  }
}
