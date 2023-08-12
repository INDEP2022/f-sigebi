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
      this.form.patchValue(this.pageSetup);
      this.controls.idTable.disable();
      this.controls.idColumn.disable();
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
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio Un Error Al Guardar La Configuración De Columnas'
          );
        }
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.onLoadToast(
          'success',
          'Configuración De Columnas',
          'Guardada Correctamente'
        );
        this.refresh.emit(true);
        this.modalRef.hide();
      })
    );
  }

  update() {
    this.loading = true;
    this.controls.idTable.enable();
    this.controls.idColumn.enable();
    return this.configvService.update(this.form.value).pipe(
      catchError(error => {
        this.loading = false;
        if (error.status <= 404 && error.status > 0) {
          this.controls.idTable.disable();
          this.controls.idColumn.disable();
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio Un Error Al Actualizar La Configuración De Columnas'
          );
          // this.modalRef.hide();
        }
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.onLoadToast(
          'success',
          'Configuración De Columnas',
          'Actualizada Correctamente'
        );
        this.refresh.emit(true);
        this.modalRef.hide();
      })
    );
  }
}
