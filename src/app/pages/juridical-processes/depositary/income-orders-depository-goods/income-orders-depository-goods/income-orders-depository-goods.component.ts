import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IAppointmentDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-income-orders-depository-goods',
  templateUrl: './income-orders-depository-goods.component.html',
  styles: [],
})
export class IncomeOrdersDepositoryGoodsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get date() {
    return this.form.get('date');
  }
  get user() {
    return this.form.get('user');
  }
  get charge() {
    return this.form.get('charge');
  }
  get username() {
    return this.form.get('username');
  }
  get numberGood() {
    return this.form.get('numberGood');
  }
  get depositary() {
    return this.form.get('depositary');
  }
  get contractKey() {
    return this.form.get('contractKey');
  }
  get description() {
    return this.form.get('description');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  jsonInterfaz: IAppointmentDepositary;
  objJsonInterfaz: IAppointmentDepositary[] = [];
  itemsJsonInterfaz: IAppointmentDepositary[] = [];
  itemsDepositary = new DefaultSelect<IAppointmentDepositary>();
  /*             USUARIOS
  ========================================*/
  objJsonInterfazUser: ISegUsers[] = [];
  itemsJsonInterfazUser: ISegUsers[] = [];
  itemsDepositaryUser = new DefaultSelect<ISegUsers>();

  constructor(
    private fb: FormBuilder,
    private depositaryService: MsDepositaryService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getItemsNumberBienes();
    this.getUserDepositary();

    this.form.get('numberGood')?.valueChanges.subscribe(data => {
      if (data) {
        this.objJsonInterfaz = this.itemsJsonInterfaz.filter(
          X => X.appointmentNumber === data
        );
        this.form.get('depositary').setValue('');
        this.form.get('description').setValue('');
        console.log(JSON.stringify(this.objJsonInterfaz[0]));
        this.form
          .get('depositary')
          .setValue(this.objJsonInterfaz[0].responsible);
        this.form
          .get('description')
          .setValue(this.objJsonInterfaz[0].observation);
        this.form.patchValue(this.objJsonInterfaz[0]);
      }
    });
    //
    //
    //

    this.form.get('user')?.valueChanges.subscribe(data => {
      this.form.get('username').setValue('');
      this.form.get('charge').setValue('');
      if (data) {
        this.objJsonInterfazUser = this.itemsJsonInterfazUser.filter(
          X => X.id === data
        );
        this.form.get('username').setValue(this.objJsonInterfazUser[0].name);
        this.form
          .get('charge')
          .setValue(this.objJsonInterfazUser[0].profession);
      }
    });
  }

  getUserDepositary() {
    console.log('====================================');
    let params = new FilterParams();
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: resp => {
        console.log(JSON.stringify(resp.data));
        this.itemsJsonInterfazUser = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  getItemsNumberBienes() {
    this.depositaryService.getGoodAppointmentDepositaryByNoGood().subscribe({
      next: resp => {
        console.log(JSON.stringify(resp.data));
        this.itemsJsonInterfaz = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }
  print() {
    alert(JSON.stringify(this.form.value)); //jesisca  jasper - report
  }
  /**
    @method: metodo para iniciar el formulario
    @author:  Alexander Alvarez
    @since: 27/09/2022
  */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      contractKey: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      depositary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      date: [null, [Validators.required]],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      username: [null, [Validators.required]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }
}
