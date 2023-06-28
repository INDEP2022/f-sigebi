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
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
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
      name: [null, [Validators.required, Validators.maxLength(50)]],
      keyId: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      description: [null, [Validators.maxLength(100)]],
      version: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      active: [null],
      editable: [null],
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
    this.loading = true;
    console.log(this.genericsForm.value);
    this.genericsService.create(this.genericsForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
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
