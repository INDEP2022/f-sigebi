import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  form: FormGroup = this.fb.group(new PageSetupForm());
  @Input() pageSetup: any;
  title: string = 'Campos para Tablas y columnas"';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

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
    }
  }

  close() {
    this.modalRef.hide();
  }

  save() {
    console.log('llego');
    if (!this.form.valid) {
      console.log('form no valido');
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
        this.refresh.emit(true);
        this.modalRef.hide();
      })
    );
  }
}
