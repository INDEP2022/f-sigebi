import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import {
  IAppointmentDepositary,
  IDepositaryAppointments,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
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
  userPuesto: ISegUsers[] = [];
  itemsDepositaryUser = new DefaultSelect<ISegUsers>();
  datosUser: TokenInfoModel;

  interfasValorBienes: {
    numBien: number;
    cveContrato: string;
    depositario: string;
    desc: string;
    nomPantall: string;
  };

  //===================
  users$ = new DefaultSelect<ISegUsers>();
  origin: string = null;
  depoAppointments: IDepositaryAppointments;
  origin2: string = null;
  noBienParams: number = null;

  constructor(
    private fb: FormBuilder,
    private depositaryService: MsDepositaryService,
    private usersService: UsersService,
    private valorBien: NumBienShare,
    private router: Router,
    private authService: AuthService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    // this.getUserDepositary();
    this.valorBien.SharingNumbien.subscribe({
      next: res => {
        this.interfasValorBienes = res;
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
    this.buildForm();
  }

  getUserDepositary() {
    let params = new FilterParams();
    this.usersService.getUsersJob().subscribe({
      next: resp => {
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

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
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
    if (this.form.get('charge').invalid) {
      this.onLoadToast(
        'success',
        'Info',
        'Verifique que la información este correcta'
      );
      return;
    }

    const fecha = moment(this.form.get('date').value).format('YYYY-MM-DD');
    let params = {
      //P_VALORES: this.form.value,
      P_NOMBRA: this.depoAppointments.appointmentNum,
      P_NO_BIEN: this.form.get('numberGood').value,
      P_PFIRMA: this.form.get('userId').value.id,
      P_FECHA: fecha,
    };
    /* let params = {
      P_NOMBRA: 383,
      P_NO_BIEN: 40488,
      P_PFIRMA: 'AAAGUILAB',
      P_FECHA: '2022-05-19',
    }; */

    this.siabService
      .fetchReport('RDEPINGXBIEN.', params)
      //.fetchReport('blank', params)
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/userIdpdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
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
      contractKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      depositary: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(300)],
      ],
      date: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.maxLength(255)]],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });

    this.form.get('date').setValue(new Date(Date.now()));
    this.form.get('numberGood').setValue(this.interfasValorBienes.numBien);
    this.form.get('contractKey').setValue(this.interfasValorBienes.cveContrato);
    this.form.get('depositary').setValue(this.interfasValorBienes.depositario);
    this.form.get('description').setValue(this.interfasValorBienes.desc);
    //this.origin = this.interfasValorBienes.nomPantall;
    this.origin = this.activatedRoute.snapshot.queryParamMap.get('origin');
    this.getDepositaryAppointments();
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getDescUser(event: Event) {
    let userDatos = JSON.parse(JSON.stringify(event));
    this.form.get('username').setValue(userDatos.name);
    this.dynamicCatalogsService
      .getPuestovalue(userDatos.positionKey)
      .subscribe({
        next: resp => {
          this.form.get('charge').setValue(resp.data.value);
        },
        error: err => {
          this.form.get('charge').setValue('');
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
  }

  goBack() {
    if (this.origin == 'FCONDEPODISPAGOS') {
      const good =
        this.form.get('numberGood').value != null
          ? this.form.get('numberGood').value
          : '';
      if (good != null) {
        this.router.navigate([
          '/pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/' +
            good,
        ]);
      } else {
        this.router.navigate([
          '/pages/juridical/depositary/payment-dispersion-process/query-related-payments-depositories/',
        ]);
      }
    }
  }

  getDepositaryAppointments() {
    if (this.form.get('numberGood').value == null) {
      return;
    }
    let params = new ListParams();
    params['filter.goodNum'] = `$eq:${this.form.get('numberGood').value}`;
    params['filter.revocation'] = `$eq:N`;
    this.depositaryService.getAppointments(params).subscribe({
      next: resp => {
        this.depoAppointments = resp.data[0];
      },
    });
  }
}
