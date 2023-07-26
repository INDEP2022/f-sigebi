import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { InvoiceFolio } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-series-folioseparate-modal',
  templateUrl: './series-folioseparate-modal.component.html',
  styles: [],
})
export class SeriesFoliosSeparateModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  allotment: any;
  folio: InvoiceFolio;
  title: string = 'Folio Apartado';
  edit: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private invoceFolio: InvoicefolioService,
    private userService: AuthService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      folioinvoiceId: [null],
      series: [null, Validators.pattern(STRING_PATTERN)],
      invoice: [null, Validators.required],
      pulledapart: ['M', Validators.required],
      recordNumber: [null],
      recordDate: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      this.form
        .get('recordNumber')
        .patchValue(this.allotment.comerF.recordUser);
    }

    console.log(this.folio);
  }

  close() {
    this.modalRef.hide();
  }

  async saveData() {
    this.loading = true;
    if (this.edit) {
      const newData = this.form.value;

      newData.recordDate = newData.recordDate.split('/').reverse().join('/');

      this.invoceFolio.updateFolioSeparate(newData).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true, this.folio);
          this.alert('success', 'Folio Apartado', 'Actualizado correctamente');
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al actualizar el folio'
          );
        },
      });
    } else {
      const { invoice } = this.form.value;
      const user = this.userService.decodeToken();
      const aux_folio = await this.validateMaxFolio(
        Number(this.folio.folioinvoiceId)
      );

      if (!aux_folio) {
        this.alert('error', 'Error', 'No se pudo obtener el maximo folio');
        this.loading = false;
        return;
      }

      if (invoice <= Number(aux_folio.max_folio)) {
        this.alert(
          'error',
          'Error',
          'El folio ya esta reportado en uso en el sistema, ya no puede ser reutilizado'
        );
        this.form.get('invoice').patchValue(null);
        this.loading = false;
        return;
      }

      this.form.get('folioinvoiceId').patchValue(this.folio.folioinvoiceId);
      this.form.get('series').patchValue(this.folio.series);
      this.form.get('recordNumber').patchValue(user.username.toUpperCase());
      this.form.get('recordDate').patchValue(new Date());

      const newData = this.form.value;

      newData.recordDate = this.datePipe.transform(
        newData.recordDate,
        'yyyy-MM-dd'
      );

      this.invoceFolio.createFolioSeparate(newData).subscribe({
        next: () => {
          this.folio.availableFolios = String(
            Number(this.folio.availableFolios) - 1
          );
          this.folio.usedFolios = String(Number(this.folio.usedFolios) + 1);

          const dataUpdate: any = { ...this.folio };

          dataUpdate.recordDate = dataUpdate.recordDate
            .split('/')
            .reverse()
            .join('/');
          dataUpdate.validity = dataUpdate.validity
            .split('/')
            .reverse()
            .join('/');

          delete dataUpdate.catDelegation;
          delete dataUpdate.totalFolios;
          delete dataUpdate.comerStatus;

          this.invoceFolio.updateFolio(dataUpdate).subscribe({
            next: () => {
              this.loading = false;
              this.modalRef.hide();
              this.modalRef.content.callback(true, this.folio);
              this.alert('success', 'Folio Apartado', 'Creado correctamente');
            },
            error: () => {
              this.loading = false;
              this.alert(
                'error',
                'Error',
                'Ha ocurrido un error al actualizar el folio'
              );
            },
          });
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al guardar el folio apartado'
          );
        },
      });
    }
  }

  async validateMaxFolio(folioinvoiceId: number) {
    return firstValueFrom(
      this.invoceFolio.getMaxFolio(folioinvoiceId).pipe(
        map(data => data),
        catchError(data => of(null))
      )
    );
  }
}
