import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depository-fees',
  templateUrl: './depository-fees.component.html',
  styles: [],
})
export class DepositoryFeesComponent extends BasePage implements OnInit {
  data: any[];

  form: FormGroup;

  get appointment() {
    return this.form.get('appointment');
  }
  get idPayment() {
    return this.form.get('idPayment');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  origin: string = null;
  origin2: string = null;
  noBienParams: number = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'] ?? null;
        if (this.origin == 'FCONDEPODISPAGOS') {
          this.noBienParams = params['p_bien']
            ? Number(params['p_bien'])
            : null;
        }
        this.origin2 = params['origin2'] ?? null;
      });
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      appointment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      idPayment: [null, [Validators.required]],
    });
  }
  goBack() {
    if (this.origin == 'FCONDEPODISPAGOS') {
      this.router.navigate(
        [
          '/pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/' +
            this.noBienParams,
        ],
        {
          queryParams: {
            origin: this.origin2,
            goodNumber: this.noBienParams,
          },
        }
      );
    }
  }
}
