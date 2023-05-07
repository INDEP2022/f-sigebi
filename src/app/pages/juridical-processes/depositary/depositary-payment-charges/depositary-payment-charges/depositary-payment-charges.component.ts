import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRefPayDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { MsDepositaryPaymentService } from 'src/app/core/services/ms-depositarypayment/ms-depositarypayment.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-depositary-payment-charges',
  templateUrl: './depositary-payment-charges.component.html',
  styles: [],
})
export class DepositaryPaymentChargesComponent
  extends BasePage
  implements OnInit
{
  data: any[];

  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get event() {
    return this.form.get('event');
  }
  get bank() {
    return this.form.get('bank');
  }
  get loand() {
    return this.form.get('loand');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  loadItemsJson: IRefPayDepositary[] = [];
  ItemsJson: IRefPayDepositary[] = [];
  itemsJsonInterfaz: IRefPayDepositary[] = [];

  constructor(
    private fb: FormBuilder,
    private Service: MsDepositaryPaymentService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.loadCargaBienes();
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      event: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cve_bank: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      loand: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  loadCargaBienes() {
    this.Service.getRefPayDepositories().subscribe({
      next: resp => {
        this.loadItemsJson = resp.data;
        console.log(JSON.stringify(this.loadItemsJson));
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexi�n de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  loadTablaDispersiones() {
    let filter = 'filter.noGood=' + this.form.get('numberGood').value;
    this.Service.getRefPayDepositories(filter).subscribe({
      next: resp => {
        this.data = resp.data;
        console.log(' loadTablaDispersiones ');
        console.log(JSON.stringify(this.data));
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexi�n de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  paymentDispersion() {
    /*
MANDA A LLAMAR LA P�GINA
FCONDEPOCONCILPAG
src\app\pages\juridical-processes\depositary\payment-dispersal-process\conciliation-depositary-payments

*/
  }

  onSearch() {
    this.cleanFild();
    alert(this.form.get('numberGood').value);
    console.warn(JSON.stringify(this.loadItemsJson));

    this.ItemsJson = this.loadItemsJson.filter(
      X => X.noGood === this.form.get('numberGood').value
    );
    console.error(JSON.stringify(this.ItemsJson[0]));
    this.form.get('event').setValue(this.ItemsJson[0].description);
    this.form.get('cve_bank').setValue(this.ItemsJson[0].cve_bank);
    this.form.get('loand').setValue(this.ItemsJson[0].amount);
    console.warn(JSON.stringify(this.ItemsJson[0]));
    alert(JSON.stringify(this.ItemsJson[0]));
    this.loadTablaDispersiones();
  }

  cleanFild() {
    alert('Limpia');
    this.form.get('event').setValue('');
    this.form.get('cve_bank').setValue('');
    this.form.get('loand').setValue('');
  }
}
