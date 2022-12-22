import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RES_CANCEL_VALUATION_COLUMS } from './res-cancel-valuation-columns';

@Component({
  selector: 'app-res-cancel-valuation',
  templateUrl: './res-cancel-valuation.component.html',
  styles: [],
})
export class resCancelValuationComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...RES_CANCEL_VALUATION_COLUMS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      folios: [null, [Validators.required]],
      radio: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      cve: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      receptionDate: [null, [Validators.required, maxDate(new Date())]],
      elaborationDate: [null, [Validators.required, maxDate(new Date())]],
      sender: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      senderTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addresseeTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  data = [
    {
      noBien: 564,
      description: 'Descripción del 564',
      amount: '$41,151.00',
      status: 'Disponible',
      motive: 'Motivo 564',
    },
    {
      noBien: 45,
      description: 'Descripción del 45',
      amount: '$1,500.00',
      status: 'No Disponible',
      motive: 'Motivo 45',
    },
    {
      noBien: 785,
      description: 'Descripción del 785',
      amount: '$201,500.00',
      status: 'Disponible',
      motive: 'Motivo 785',
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
