import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-series-folios-control-modal',
  templateUrl: './series-folios-control-modal.component.html',
  styles: [],
})
export class SeriesFoliosControlModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Folio';
  edit: boolean = false;
  delegations: DefaultSelect = new DefaultSelect();
  types: DefaultSelect = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private invoceFolio: InvoicefolioService,
    private userService: AuthService,
    private datePipe: DatePipe
  ) {
    super();

    this.types = new DefaultSelect(
      [
        {
          label: 'Factura',
          value: 'DF',
        },
        {
          label: 'Comp. Simplificado',
          value: 'CS',
        },
        {
          label: 'Nota de Credito',
          value: 'NCR',
        },
        {
          label: 'Factura CFDI',
          value: 'FAC',
        },
      ],
      4
    );
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      folioinvoiceId: [null],
      delegationNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      series: [null, [Validators.required]],
      invoiceStart: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      invoiceEnd: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      validity: [null, [Validators.required]],
      type: ['DF', [Validators.required]],
      statusfactId: [null],
      totalFolios: [null, Validators.pattern(NUMBERS_PATTERN)],
      availableFolios: [null],
      usedFolios: [null],
      recordUser: [null],
      recordDate: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
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
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  getDelegation(params?: Params) {
    params['limit'] = 50;
    params['sortBy'] = 'id:ASC';
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  async saveData() {
    this.loading = true;
    const user = this.userService.decodeToken();
    if (this.edit) {
      const {
        series,
        invoiceStart,
        invoiceEnd,
        delegationNumber,
        folioinvoiceId,
        validity,
      } = this.form.value;

      const pass = await this.validateFolXSerie(
        series,
        invoiceStart,
        invoiceEnd,
        delegationNumber,
        folioinvoiceId
      );

      if (pass.aux_folini == 0) {
        this.loading = false;
        this.alert(
          'error',
          'Error',
          'Los Folios que esta definiendo ya existen en otra serie, favor de verificar'
        );
        return;
      }

      const pass2 = await this.validateSerieUse(Number(folioinvoiceId));

      if (pass2.aux_number == 1) {
        this.form.get('statusfactId').patchValue('ACT');
        this.form.get('recordUser').patchValue(user.username.toUpperCase());
        this.form.get('recordDate').patchValue(new Date());
        this.form
          .get('availableFolios')
          .patchValue(
            1 + (Number(invoiceEnd ?? 0) - Number(invoiceStart ?? 0))
          );
        this.form.get('usedFolios').patchValue(0);

        const data: any = this.form.value;
        if (typeof data.recordDate == 'object') {
          data.recordDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        }

        if (typeof data.validity == 'object') {
          data.validity = this.datePipe.transform(validity, 'yyyy-MM-dd');
        } else {
          data.validity = data.validity.split('/').reverse().join('/');
        }

        delete data.totalFolios;

        this.invoceFolio.updateFolio(data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.hide();
            this.modalRef.content.callback(true);
            this.alert('success', 'Folio', 'Actualizado Correctamente');
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
        this.loading = false;
        this.alert(
          'error',
          'Error',
          'La serie ya esta en uso, no se puede modificar el folio'
        );
      }
    } else {
      const {
        series,
        invoiceStart,
        invoiceEnd,
        delegationNumber,
        folioinvoiceId,
        validity,
      } = this.form.value;

      const pass = await this.validateFolXSerie(
        series,
        invoiceStart,
        invoiceEnd,
        delegationNumber,
        folioinvoiceId
      );

      if (pass.aux_folini == 1) {
        this.form.get('statusfactId').patchValue('ACT');
        this.form.get('recordUser').patchValue(user.username.toUpperCase());
        this.form.get('recordDate').patchValue(new Date());
        this.form
          .get('availableFolios')
          .patchValue(
            1 + (Number(invoiceEnd ?? 0) - Number(invoiceStart ?? 0))
          );
        this.form.get('usedFolios').patchValue(0);

        const data: any = this.form.value;

        data.recordDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

        data.validity = this.datePipe.transform(validity, 'yyyy-MM-dd');

        delete data.folioinvoiceId;

        this.invoceFolio.createFolio(data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.hide();
            this.modalRef.content.callback(true);
            this.alert('success', 'Folio', 'Creado Correctamente');
          },
          error: () => {
            this.loading = false;
            this.alert(
              'error',
              'Error',
              'Ha ocurrido un error al guardar el folio'
            );
          },
        });
      } else {
        this.loading = false;
        this.alert(
          'error',
          'Error',
          'Los Folios que esta definiendo ya existen en otra serie, favor de verificar'
        );
      }
    }
  }

  async validateFolXSerie(
    serie: string,
    invoiceStart: number,
    invoiceEnd: number,
    delegationNumber: number,
    folioinvoiceId: number
  ) {
    const body: any = {
      pSerie: serie,
      pFolioIni: Number(invoiceStart),
      pFolioFin: Number(invoiceEnd),
      pRegion: Number(delegationNumber),
      idFolioFact: folioinvoiceId,
    };
    return firstValueFrom(
      this.invoceFolio.getAuxFolio(body).pipe(
        map(data => data),
        catchError(data => of(null))
      )
    );
  }

  async validateSerieUse(folioinvoiceId: number) {
    return firstValueFrom(
      this.invoceFolio.validateSerieInUse(folioinvoiceId).pipe(
        map(data => data),
        catchError(data => of(null))
      )
    );
  }
}
