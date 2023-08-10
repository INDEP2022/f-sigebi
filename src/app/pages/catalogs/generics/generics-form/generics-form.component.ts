import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IGeneric } from '../../../../core/models/catalogs/generic.model';
import { GenericService } from './../../../../core/services/catalogs/generic.service';

@Component({
  selector: 'app-generics-form',
  templateUrl: './generics-form.component.html',
  styles: [],
})
export class GenericsFormComponent extends BasePage implements OnInit {
  genericsForm: FormGroup = new FormGroup({});
  title: string = 'Genérico';
  edit: boolean = false;
  generics: IGeneric;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericsService: GenericService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.genericsForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      keyId: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      description: [
        null,
        [
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      version: [
        null,
        [
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(20),
          Validators.required,
        ],
      ],
      active: [null, [Validators.required]],
      editable: [null, [Validators.required]],
    });
    const fieldName = document.getElementById('inputName');
    const fieldKeyId = document.getElementById('inputKeyId');
    if (this.generics != null) {
      this.render.addClass(fieldName, 'disabled');
      this.render.addClass(fieldKeyId, 'disabled');
      this.edit = true;
      this.genericsForm.patchValue(this.generics);
    } else {
      this.render.removeClass(fieldName, 'disabled');
      this.render.removeClass(fieldKeyId, 'disabled');
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.genericsForm.controls['name'].value.trim() === '' ||
      this.genericsForm.controls['description'].value.trim() === '' ||
      this.genericsForm.controls['keyId'].value.trim() === '' ||
      this.genericsForm.controls['version'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;

    console.log(this.genericsForm.value);
    this.genericsService.create(this.genericsForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.alert('error', 'El Identficador Clave ya fue registrado', '');
        this.loading = false;
      },
    });
  }

  update() {
    // Corregir el repositorio del service cuando haya aclaracion del endpoint
    // porque ocupa dos valores para la url
    this.loading = true;
    this.genericsService.newUpdate(this.genericsForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
