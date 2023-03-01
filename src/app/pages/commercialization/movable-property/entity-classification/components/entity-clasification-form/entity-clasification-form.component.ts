import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import { ITypeEntityGov } from 'src/app/core/models/ms-parametercomer/type-entity-gov.model';
import { TypeEntityGovService } from 'src/app/core/services/ms-parametercomer/type-entity-gov.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EntityClasificationForm } from '../../utils/entity-clasification-form';

@Component({
  selector: 'app-entity-clasification-form',
  templateUrl: './entity-clasification-form.component.html',
  styles: [],
})
export class EntityClasificationFormComponent
  extends BasePage
  implements OnInit
{
  @Output() refresh = new EventEmitter<boolean>();
  typeEntity: ITypeEntityGov = null;
  title: string = 'Tipo entidad';
  edit: boolean = false;
  form = this.fb.group(new EntityClasificationForm());
  constructor(
    private modalRef: BsModalRef<EntityClasificationFormComponent>,
    private typeEntityGovService: TypeEntityGovService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.typeEntity) {
      this.edit = true;
      this.form.patchValue(this.typeEntity);
      this.form.controls.id.disable();
    }
  }

  close() {
    this.modalRef.hide();
  }

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.edit) {
      this.update().subscribe();
    } else {
      this.create().subscribe();
    }
  }

  create() {
    this.loading = true;
    return this.typeEntityGovService.create(this.form.value).pipe(
      catchError(error => {
        this.loading = false;
        if (error.status <= 404 && error.status > 0) {
          this.onLoadToast('error', 'Error', 'Ocurrio un error al guardar');
        }
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.onLoadToast('success', 'Registro guardado', '');
        this.refresh.emit(true);
        this.modalRef.hide();
      })
    );
  }

  update() {
    this.loading = true;
    return this.typeEntityGovService
      .update(this.typeEntity.id, this.form.value)
      .pipe(
        catchError(error => {
          this.loading = false;
          if (error.status <= 404 && error.status > 0) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al actualizar'
            );
          }
          return throwError(() => error);
        }),
        tap(() => {
          this.loading = false;
          this.onLoadToast('success', 'Registro actualizado', '');
          this.refresh.emit(true);
          this.modalRef.hide();
        })
      );
  }
}
