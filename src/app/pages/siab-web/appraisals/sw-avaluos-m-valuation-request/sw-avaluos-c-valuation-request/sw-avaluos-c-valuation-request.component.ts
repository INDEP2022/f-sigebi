import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { VALUATION_REQUEST_COLUMNS } from './valuation-request-columns';

@Component({
  selector: 'app-sw-avaluos-c-valuation-request',
  templateUrl: './sw-avaluos-c-valuation-request.component.html',
  styles: [],
})
export class SwAvaluosCValuationRequestComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      cveService: [null, [Validators.required]],
      folio: [null, [Validators.required]],

      sender: [null, [Validators.required]],
      senderTxt: [null, [Validators.required]],

      addressee: [null, [Validators.required]],
      addresseeTxt: [null, [Validators.required]],

      city: [null, [Validators.required]],

      paragraph1: [null, [Validators.required]],
      paragraph2: [null, [Validators.required]],
      paragraph3: [null, [Validators.required]],

      user: [null, [Validators.required]],
      txtUserCCP: [null, [Validators.required]],
    });
  }

  data = [
    {
      noBien: 564,
      description: 'Descripción del 564',
      amount: '$41,151.00',
      status: 'Disponible',
    },
    {
      noBien: 45,
      description: 'Descripción del 45',
      amount: '$1,500.00',
      status: 'No Disponible',
    },
    {
      noBien: 785,
      description: 'Descripción del 785',
      amount: '$201,500.00',
      status: 'Disponible',
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
