import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { HttpClient } from '@angular/common/http';
import { INumeraryCategories } from 'src/app/core/models/catalogs/numerary-categories-model';
//Services
import { catchError, mergeMap, of } from 'rxjs';
import { NumeraryCategoriesService } from 'src/app/core/services/catalogs/numerary-categories.service';

@Component({
  selector: 'app-cat-effective-numeraire-modal',
  templateUrl: './cat-effective-numeraire-modal.component.html',
  styles: [],
})
export class CatEffectiveNumeraireModalComponent
  extends BasePage
  implements OnInit
{
  numeraryCategoriesForm: ModelForm<INumeraryCategories>;
  numeraryCategories: INumeraryCategories;
  title: string = 'Categoría para Numerario Efectivo';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private numeraryCategoriesService: NumeraryCategoriesService,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.numeraryCategoriesForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      enterExit: [null, [Validators.required]],
      noRegistration: [null],
    });
    if (this.numeraryCategories != null) {
      this.edit = true;
      console.log(this.numeraryCategories);
      this.numeraryCategoriesForm.patchValue(this.numeraryCategories);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  /*create() {
    this.loading = true;
    this.numeraryCategoriesService
      .create(this.numeraryCategoriesForm.value)
      .subscribe({
        next: data => {
          this.handleSuccess();
        },
        error: error => (this.loading = false),
      });
  }*/
  create() {
    this.loading = true;
    const formData = this.numeraryCategoriesForm.value;

    this.numeraryCategoriesService
      .getById(`/id/${formData.id}`)
      .pipe(
        catchError(error => {
          // Si ocurre un error, asumimos que el registro no existe y continuamos con la creación.
          return of(null);
        }),
        mergeMap((id: any) => {
          if (id) {
            // Si el registro ya existe, mostrar una alerta o tomar alguna acción
            this.alert('warning', 'La Categoría ya existe', '');
            this.loading = false;
            return [];
          } else {
            // Si el registro no existe, proceder con la creación del registro
            return this.numeraryCategoriesService.create(formData);
          }
        })
      )
      .subscribe({
        next: data => {
          if (data) {
            // La creación fue exitosa, manejarlo en consecuencia
            this.handleSuccess();
          }
        },
        error: error => {
          this.loading = false;
          console.error(
            'Error al crear o consultar el registro existente:',
            error
          );
        },
      });
  }

  update() {
    this.loading = true;
    this.numeraryCategoriesService
      .update(this.numeraryCategories.id, this.numeraryCategoriesForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
