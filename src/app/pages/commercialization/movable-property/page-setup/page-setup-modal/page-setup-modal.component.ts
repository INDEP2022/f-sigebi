import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import { ConfigvtadmunService } from 'src/app/core/services/ms-parametercomer/configvtadmun.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PageSetupForm } from '../utils/page-setup-form';

@Component({
  selector: 'app-page-setup-modal',
  templateUrl: './page-setup-modal.component.html',
  styles: [],
})
export class PageSetupModalComponent extends BasePage implements OnInit {
  form = this.fb.group(new PageSetupForm());
  pageSetup: any;
  title: string = 'Campos para Tablas y columnas';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();
  get controls() {
    return this.form.controls;
  }
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private configvService: ConfigvtadmunService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.pageSetup) {
      this.edit = true;
      this.controls.idTable.disable();
      this.controls.idColumn.disable();
      this.form.patchValue(this.pageSetup);
    } else {
      this.controls.visualiza.setValue('1');
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
    return this.configvService.create(this.form.value).pipe(
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
    return this.configvService.update(this.form.value).pipe(
      catchError(error => {
        this.loading = false;
        if (error.status <= 404 && error.status > 0) {
          this.onLoadToast('error', 'Error', 'Ocurrio un error al actualizar');
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
