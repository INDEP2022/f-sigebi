import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { DETAILS_OI_COLUMNS } from './c-b-rdodi-c-reclass-recovery-orders-columns';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-c-b-rdodi-c-reclass-recovery-orders',
  templateUrl: './c-b-rdodi-c-reclass-recovery-orders.component.html',
  styles: [],
})
export class CBRdodiCReclassRecoveryOrdersComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DETAILS_OI_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      idOi: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      idArea: ['', [Validators.required]],
      ur: ['', [Validators.required]],
      clientRFC: ['', [Validators.required]],
      descripRFC: ['', [Validators.required]],
      anexo: ['', [Validators.required]],
      tiPe: ['', [Validators.required]],
      idEvent: ['', [Validators.required]],
      concept: ['', [Validators.required]],
      idBank: ['', [Validators.required]],
      ordenDate: ['', [Validators.required]],
      numovto: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      idPayment: ['', [Validators.required]],
    });
  }
  data = [
    {
      lote: 'lote 1',
      descripcion: 'descripción del lote 1',
      mandato: 'Mandato 1',
      importe: '100',
      importeSinIva: '16',
    },
    {
      lote: 'lote 2',
      descripcion: 'descripción del lote 2',
      mandato: 'Mandato 2',
      importe: '100',
      importeSinIva: '16',
    },
    {
      lote: 'lote 3',
      descripcion: 'descripción del lote 3',
      mandato: 'Mandato 3',
      importe: '100',
      importeSinIva: '16',
    },
  ];
}
