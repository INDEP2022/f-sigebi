import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
//Services
import { ComerEventosServiceTwo } from 'src/app/core/services/ms-event/comer-eventos-ms-new.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-authorization-keys',
  templateUrl: './authorization-keys.component.html',
  styles: [],
})
export class AuthorizationKeysComponent extends BasePage implements OnInit {
  eventForm: ModelForm<IComerEvent>;
  form: FormGroup = new FormGroup({});
  users = new DefaultSelect<IComerEvent>();
  processKey: any;
  observations: any;
  keyAuth: boolean = false;

  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosServiceTwo,
    private utilComerV1Service: UtilComerV1Service,
    private clipboard: Clipboard
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
      encrip: [null, [Validators.required]],
    });
  }

  getByIdTwo(id?: any): void {
    this.comerEventosService.getByIdTwo(id).subscribe({
      next: data => {
        this.eventForm.controls['processKey'].setValue(data.processKey);
        this.eventForm.controls['observations'].setValue(data.observations);
      },
      error: (error: any) => {
        if (error.status == 400) {
          this.alert('warning', 'No se encontraron registros', '');
        }
        this.eventForm.controls['processKey'].setValue('');
        this.eventForm.controls['observations'].setValue('');
        this.form.controls['encrip'].setValue('');
      },
    });
  }

  search() {
    this.getByIdTwo(this.eventForm.get('id').value);
    this.keyAuth = true;
  }

  generateKey(): void {
    let key = this.eventForm.controls['id'].value;
    this.form.controls['txtEncrip'].setValue(key);
    this.loading = true;
    this.utilComerV1Service.encrypt(this.form.value).subscribe({
      next: response => {
        //TODO: Validate Response
        if (response !== null) {
          this.form.controls['encrip'].setValue(response);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
    /*this.utilComerV1Service.encrypt(this.form.value).subscribe({
      next: data => this.onLoadToast('success', 'Solicitud finalizada con éxito', ''),
      error: error => (this.loading = false),
    })*/
  }

  copy() {
    this.clipboard.copy(this.form.value['encrip']);
    this.onLoadToast('success', 'La Clave de Autorización ha sido copiada', '');
  }

  clean() {
    this.form.reset();
    this.eventForm.reset();
    this.keyAuth = false;
  }
}
