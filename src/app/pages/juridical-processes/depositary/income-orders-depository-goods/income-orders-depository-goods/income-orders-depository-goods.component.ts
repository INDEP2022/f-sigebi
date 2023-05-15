import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IAppointmentDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { NumBienShare } from 'src/app/core/services/ms-depositary/num-bien-share.services';
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

  itemsPass: number;
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
  datosUser: TokenInfoModel;

  interfasValorBienes: {
    numBien: number;
    cveContrato: string;
    depositario: string;
    desc: string;
    nomPantall: string;
  };
  constructor(
    private fb: FormBuilder,
    private depositaryService: MsDepositaryService,
    private usersService: UsersService,
    private valorBien: NumBienShare,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.valorBien.SharingNumbien.subscribe({
      next: res => {
        this.interfasValorBienes = res;
      },
      error: err => {
        //alert('SharingNumbien' + err);
      },
    });
    this.buildForm();
  }

  getUserDepositary() {
    console.log('====================================');
    let params = new FilterParams();
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: resp => {
        // console.log(JSON.stringify(resp.data));
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
    /* this.router.navigate;
   ("pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/"+3801);*/
  }
  /**
    @method: metodo para iniciar el formulario
    @author:  Alexander Alvarez
    @since: 27/09/2022
  */
  private buildForm() {
    this.datosUser = this.authService.decodeToken();
    this.getItemsNumberBienes();

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
      userId: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      username: [null, [Validators.required]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    this.form.get('userId').setValue(this.datosUser.username);
    this.form.get('username').setValue(this.datosUser.name);
    this.form.get('charge').setValue(this.datosUser.puesto);
    this.form.get('numberGood').setValue(this.interfasValorBienes.numBien);
    this.form.get('contractKey').setValue(this.interfasValorBienes.cveContrato);
    this.form.get('depositary').setValue(this.interfasValorBienes.depositario);
    this.form.get('description').setValue(this.interfasValorBienes.desc);
  }
}
