import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRequesNumeraryEnc } from 'src/app/core/models/ms-numerary/numerary.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { RequestNumeraryDetService } from 'src/app/core/services/ms-numerary/request-numerary-det.service';
import { RequestNumeraryEncService } from 'src/app/core/services/ms-numerary/request-numerary-enc.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListNumeraryComponent } from '../list-data/list-numerary.component';
import { NumDetGoodsDetail } from '../models/goods-det';
import { REQUEST_NUMERARY_COLUMNS } from './numerary-request-columns';

@Component({
  selector: 'app-numerary-request',
  templateUrl: './numerary-request.component.html',
  styles: [],
})
export class NumeraryRequestComponent extends BasePage implements OnInit {
  form: FormGroup;
  registers: number = null;
  data1: any[] = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  isActions: boolean = true;
  isNew: boolean = true;
  totalItems2: number = 0;
  @ViewChild('file', { static: false }) files: ElementRef<HTMLInputElement>;
  isSearch: boolean = true;

  constructor(
    private fb: FormBuilder,
    private readonly numEncServ: RequestNumeraryEncService,
    private readonly datePipe: DatePipe,
    private readonly userService: UsersService,
    private modalService: BsModalService,
    private readonly numDetService: RequestNumeraryDetService,
    private readonly goodParameterServ: GoodParametersService,
    private readonly delegationServ: DelegationService,
    private readonly authServ: AuthService,
    private readonly massiveGoodServ: MassiveGoodService,
    private readonly goodProceesServ: GoodProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        delete: true,
        edit: false,
        columnTitle: 'Acciones',
        position: 'right',
      },
      columns: REQUEST_NUMERARY_COLUMNS,
      rowClassFunction: (row: any) => {
        let cell = '';
        if (row.data.valid) {
          if (row.data.valid == 'N') {
            cell = 'bg-dark text-white';
          }
        } else {
          cell = '';
        }

        return cell;
      },
    };
  }

  status: DefaultSelect = new DefaultSelect(
    [
      {
        id: 'SOLICITADA',
        val: 'S',
      },
      {
        id: 'PROCESADA',
        val: 'P',
      },
      {
        id: 'CANCELADA',
        val: 'C',
      },
    ],
    3
  );

  currencyList: DefaultSelect = new DefaultSelect(
    [
      {
        id: 'PESOS',
        val: 'MN',
      },
      {
        id: 'DOLARES',
        val: 'USD',
      },
      {
        id: 'EUROS',
        val: 'EUR',
      },
      {
        id: 'CONV/PESOS',
        val: 'CN',
      },
      {
        id: 'CONV/DOLARES',
        val: 'CD',
      },
    ],
    5
  );

  ngOnInit(): void {
    this.prepareForm();

    this.filterParams2.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.totalItems2 > 0) this.getNumDet();
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      solnumId: [null],
      solnumDate: [null],
      description: [null],
      solnumType: [null],
      delegationNumber: [null],
      user: [null],
      procnumId: [null],
      solnumStatus: [null],
      recordNumber: [null],
      currency: [null],
      name: [null],
      desc_del: [null],
    });

    const { solnumStatus } = this.form.value;

    this.isActions = ['P', 'C'].includes(solnumStatus) ? false : true;
  }

  searchNumeraryEnc() {
    this.getNumEnc();
  }

  callExc() {
    const { currency } = this.form.value;

    if (!currency) {
      this.alert('error', 'ERROR', 'Debe seleccionar el tipo de moneda');
      return;
    }

    this.files.nativeElement.click();
  }

  createFilter() {
    const { solnumId, solnumDate, solnumStatus, description, solnumType } =
      this.form.value;
    let date = solnumDate;

    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = 1;

    if (typeof solnumDate == 'object' && solnumDate) {
      date = this.datePipe.transform(solnumDate, 'yyyy-MM-dd');
    } else if (typeof solnumDate == 'string' && solnumDate) {
      date = solnumDate.split('/').reverse().join('-');
    }

    if (solnumId)
      this.filterParams
        .getValue()
        .addFilter('solnumId', solnumId, SearchFilter.EQ);
    if (date)
      this.filterParams
        .getValue()
        .addFilter('solnumDate', date, SearchFilter.EQ);
    if (solnumStatus)
      this.filterParams
        .getValue()
        .addFilter('solnumStatus', solnumStatus, SearchFilter.EQ);
    if (description)
      this.filterParams
        .getValue()
        .addFilter('description', description, SearchFilter.ILIKE);
    if (solnumType)
      this.filterParams
        .getValue()
        .addFilter('solnumType', solnumType, SearchFilter.EQ);
  }

  clearSearch() {
    this.form.reset();
    this.isNew = true;
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.data1 = [];
    this.registers = null;
    this.files.nativeElement.value = '';
    this.isActions = true;
  }

  getNumEnc() {
    this.createFilter();
    this.numEncServ
      .getAllFilter(this.filterParams.getValue().getParams())
      .subscribe({
        next: async resp => {
          this.isNew = false;
          this.totalItems = resp.count;
          resp.data.map((num: any) => {
            num.solnumDate = num.solnumDate
              ? num.solnumDate.split('-').reverse().join('/')
              : '';
          });
          const data = resp.data[0];
          this.form.patchValue(data);

          this.isActions = ['C', 'P'].includes(data.solnumStatus)
            ? false
            : true;
          this.form.get('delegationNumber').patchValue(data.delegationNumber);
          await this.postQuery(data);

          this.filterParams2.getValue().removeAllFilters();
          this.filterParams2.getValue().page = 1;
          this.filterParams2
            .getValue()
            .addFilter('solnumId', data.solnumId, SearchFilter.EQ);
          await this.getNumDet();
        },
        error: err => {
          this.totalItems = 0;
          if (err.status == 400) {
            this.alert('error', 'ERROR', 'No existe la solicitud');
          }
        },
      });
  }

  async getNumDet() {
    this.loading = true;
    this.data1 = [];
    return new Promise((resolve, reject) => {
      this.numDetService
        .getAllFilter(this.filterParams2.getValue().getParams())
        .subscribe({
          next: resp => {
            const data = resp.data;

            data.map(async good => {
              const details = await this.getDescDep(good.goodNumber);
              if (details) {
                good.commission = details.deposito ?? '';
                good.description = details.descripcion ?? '';
                good.bankDate = details.fec_insercion_banco ?? '';
              }
              this.data1 = [...data];
            });

            // this.data1 = [...data]

            this.totalItems2 = resp.count;
            this.loading = false;
            this.registers = null;
            resolve(true);
          },
          error: () => {
            this.loading = false;
            this.data1 = [];
            this.totalItems2 = 0;
            this.registers = null;
            resolve(false);
          },
        });
    });
  }

  async postQuery(data: IRequesNumeraryEnc) {
    let V_TMONEDA;

    if (data.description) {
      const etapa = await this.getEtapa();
      const desc = await this.getDesDelegation(data.delegationNumber, etapa);
      this.form.get('desc_del').patchValue(desc);
    } else {
      this.alert('error', 'ERROR', 'Error en la descripción de la solicitud');
    }

    await this.getName(data.user);

    if (data.solnumId) {
      V_TMONEDA = await this.getCurrency(data.solnumId);

      const values: any = {
        P: () => 'MN',
        D: () => 'USD',
        E: () => 'EUR',
        C: () => 'CN',
        CD: () => 'CD',
        X: () => 'X',
      };

      if (values[V_TMONEDA.trim()]() != 'X') {
        this.form.get('currency').patchValue(values[V_TMONEDA.trim()]());
      } else {
        this.form.get('currency').patchValue(null);
      }
    }
  }

  async getCurrency(solnumId: number) {
    return new Promise<string>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('solnumId', solnumId, SearchFilter.EQ);
      this.numDetService.getAllFilter(filter.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0].currencyId);
        },
        error: () => {
          resolve('X');
        },
      });
    });
  }

  async getDesDelegation(del: number, edo: number) {
    return new Promise<string>((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `${SearchFilter.EQ}:${del}`;
      params['filter.etapaEdo'] = `${SearchFilter.EQ}:${edo}`;
      this.delegationServ.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0].description);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getEtapa() {
    return new Promise<number>((resolve, reject) => {
      this.goodParameterServ.getPhaseEdo().subscribe({
        next: resp => {
          resolve(resp.stagecreated);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getDescDep(good: number) {
    return new Promise<any>((resolve, reject) => {
      this.goodProceesServ.getDescDepBan(good).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getNameDetails(user: string) {
    const params = new FilterParams();
    params.addFilter('user', user, SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.userService.getInfoUserLogued(params.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getName(user: string) {
    const params = new FilterParams();
    params.addFilter('id', user, SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.userService
        .getAllSegUsersModal(this.userService, params.getParams())
        .subscribe({
          next: resp => {
            this.form.get('name').patchValue(resp.data[0].name);
            resolve(true);
          },
          error: () => {
            resolve(true);
          },
        });
    });
  }

  showData() {
    let config: ModalOptions = {
      initialState: {
        //filtros
        paramsList: this.params,
        filterParams: this.filterParams,
        callback: async (next: boolean, data: IRequesNumeraryEnc) => {
          if (next) {
            data.solnumDate = data.solnumDate
              ? data.solnumDate.split('-').reverse().join('/')
              : '';
            this.form.patchValue(data);
            this.form.get('delegationNumber').patchValue(data.delegationNumber);
            await this.postQuery(data);
            this.isActions = ['C', 'P'].includes(data.solnumStatus)
              ? false
              : true;
            this.filterParams2.getValue().removeAllFilters();
            this.filterParams2.getValue().page = 1;
            this.filterParams2
              .getValue()
              .addFilter('solnumId', data.solnumId, SearchFilter.EQ);

            await this.getNumDet();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListNumeraryComponent, config);
  }

  newData() {
    this.form.reset();
    this.isNew = true;
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.data1 = [];
    this.registers = null;
    this.files.nativeElement.value = '';
    this.isActions = true;
    this.form.get('solnumType').patchValue('D');
  }

  async saveData() {
    const { solnumType, description } = this.form.value;

    if (!solnumType) {
      this.alert('error', 'ERROR', 'Debe especificar el tipo de solicitud');
      return;
    }

    if (!description) {
      this.alert('error', 'ERROR', 'Debe ingresar el concepto de la solicitud');
      return;
    }

    if (this.isNew) {
      if (this.data1.length > 0) {
        const user = this.authServ.decodeToken();
        const detailsUser: any = await this.getNameDetails(
          user.username == 'sigebiadmon'
            ? user.username.toLowerCase()
            : user.username.toUpperCase()
        );

        let userCreate =
          user.username == 'sigebiadmon'
            ? user.username.toLowerCase()
            : user.username.toUpperCase();

        //this.form.get('solnumId').patchValue()
        this.form
          .get('solnumDate')
          .patchValue(this.parseDateNoOffset(new Date()));
        this.form.get('solnumStatus').patchValue('S');
        this.form
          .get('delegationNumber')
          .patchValue(detailsUser.delegationNumber);
        this.form.get('user').patchValue(userCreate);
        this.form
          .get('desc_del')
          .patchValue(detailsUser.delegation.description);
        this.form.get('name').patchValue(detailsUser.userDetail.name);
      } else {
        this.alert('error', 'ERROR', 'Debe ingresar un bien para ser guardado');
        return;
      }

      for (let i = 0; i < this.data1.length; i++) {
        const valid = this.data1[i].valid ?? '';
        if (valid) {
          if (valid == 'N') {
            this.alert('error', 'ERROR', 'Error hay bienes que no son validos');
            return;
          }
        }
      }

      let body: IRequesNumeraryEnc = this.form.value;
      delete body.solnumId;
      this.createSolcEnc(body);
    } else {
      for (let i = 0; i < this.data1.length; i++) {
        const valid = this.data1[i].valid ?? '';
        if (valid) {
          if (valid == 'N') {
            this.alert('error', 'ERROR', 'Error hay bienes que no son validos');
            return;
          }
        }
      }

      let body: IRequesNumeraryEnc = this.form.value;
      await this.updateSolcEn(body);
      //update
    }
  }

  async updateSolcEn(body: IRequesNumeraryEnc) {
    delete body.currency;
    delete body.name;
    delete body.desc_del;

    if (typeof body.solnumDate == 'string') {
      body.solnumDate = body.solnumDate.split('/').reverse().join('-');
    }

    const valids = this.data1.filter(good => good.valid == 'S');

    if (valids.length > 0) {
      await this.removeAll(body.solnumId);
    }

    this.data1.map(async good => {
      if (good.valid) {
        good.solnumId = body.solnumId;
        if (typeof good.dateCalculationInterests == 'object') {
          good.dateCalculationInterests = good.dateCalculationInterests
            ? this.parseDateNoOffset(good.dateCalculationInterests)
            : good.dateCalculationInterests;
        }
        await this.createGoodDet(good);
        this.filterParams2.getValue().removeAllFilters();
        this.filterParams2.getValue().page = 1;
        this.filterParams2
          .getValue()
          .addFilter('solnumId', body.solnumId, SearchFilter.EQ);

        await this.getNumDet();
      } else {
        if (typeof good.dateCalculationInterests == 'object') {
          good.dateCalculationInterests = good.dateCalculationInterests
            ? this.parseDateNoOffset(good.dateCalculationInterests)
            : good.dateCalculationInterests;
        }
        delete good.description;
        delete good.bankDate;
        await this.updateGoodDet(good);
      }
    });

    this.numEncServ.update(body).subscribe({
      next: async resp => {
        this.alert('success', 'Solicitud', 'Ha sido actualizada');
      },
      error: () => {
        this.alert(
          'error',
          'ERROR',
          'Ocurrio un error al actualizar la solicitud'
        );
      },
    });
  }

  async removeAll(id: number) {
    return new Promise((resolve, reject) => {
      this.numDetService.removeAll(id).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  async removeGood(data: any) {
    if (!this.isActions) return;

    const { solnumId, goodNumber, valid } = data;

    const removeData = {
      solnumId,
      goodNumber,
    };

    this.alertQuestion(
      'question',
      'Eliminar',
      `¿Estás seguro de eliminar el bien: ${goodNumber}?`
    ).then(async answ => {
      if (answ.isConfirmed) {
        if (valid) {
          const index = this.data1.findIndex(
            (data: any) => data.goodNumber == goodNumber
          );
          this.data1.splice(index, 1);
          this.data1 = [...this.data1];
          this.registers = this.data1.length;
          this.totalItems2 = this.data1.length;
          this.alert('success', 'Bien', 'Ha sido eliminado');
        } else {
          await this.deleteGoodDet(removeData);
          this.filterParams2.getValue().removeAllFilters();
          this.filterParams2.getValue().page = 1;
          this.filterParams2
            .getValue()
            .addFilter('solnumId', solnumId, SearchFilter.EQ);
          await this.getNumDet();
        }
      }
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  createSolcEnc(body: IRequesNumeraryEnc) {
    this.numEncServ.create(body).subscribe({
      next: async resp => {
        this.form.get('solnumId').patchValue(resp.solnumId);
        const { solnumId } = this.form.value;

        this.alert('success', 'Solicitud', 'Ha sido creada correctamente');

        this.data1.map(async good => {
          good.solnumId = solnumId;
          good.dateCalculationInterests = good.dateCalculationInterests
            ? this.parseDateNoOffset(good.dateCalculationInterests)
            : good.dateCalculationInterests;
          await this.createGoodDet(good);
          this.filterParams2.getValue().removeAllFilters();
          this.filterParams2.getValue().page = 1;
          this.filterParams2
            .getValue()
            .addFilter('solnumId', solnumId, SearchFilter.EQ);
          await this.getNumDet();
        });

        this.isNew = false;
      },
      error: () => {
        this.alert('error', 'ERROR', 'Ocurrio un error al crear la solicitud');
      },
    });
  }

  async deleteGoodDet(body: any) {
    return new Promise((resolve, reject) => {
      this.numDetService.remove(body).subscribe({
        next: () => {
          this.alert('success', 'Bien', 'Ha sido eliminado');
          resolve(true);
        },
        error: () => {
          this.alert(
            'error',
            'Error',
            'Ocurrio un error al borrar el registro'
          );
          resolve(false);
        },
      });
    });
  }

  async createGoodDet(body: NumDetGoodsDetail) {
    return new Promise((resolve, reject) => {
      this.numDetService.create(body).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  async updateGoodDet(body: NumDetGoodsDetail) {
    return new Promise((resolve, reject) => {
      this.numDetService.update(body).subscribe({
        next: () => {
          const { solnumStatus } = this.form.value;
          this.isActions = ['P', 'C'].includes(solnumStatus) ? false : true;
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.readExcel(files[0]);
    //const fileReader = new FileReader();
    //fileReader.readAsBinaryString(files[0]);
    //fileReader.onload = () => this.readExcel(/*fileReader.result*/files[0]);
  }

  readExcel(binaryExcel: string | ArrayBuffer | any) {
    this.data1 = [];
    this.registers = null;
    const { currency, solnumId } = this.form.value;
    this.loading = true;
    this.massiveGoodServ.getDataCSVFile(currency, binaryExcel).subscribe({
      next: resp => {
        this.files.nativeElement.value = '';
        this.loading = false;
        const data = resp.data;
        this.registers = resp.data.length || 0;
        data.map(good => {
          let det: NumDetGoodsDetail = {
            allInterest: null,
            allNumerary: null,
            allPayNumber: null,
            allintPay: null,
            commission: good.deposit,
            currencyId: null,
            dateCalculationInterests: null,
            goodFatherpartializationNumber: null,
            goodNumber: good.goodNumber,
            recordNumber: null,
            solnumId: Number(solnumId),
            valid: good.valid,
            bankDate: good.bankInsertionDate,
            description: good.description,
          };

          const currencyId: any = {
            MN: () => 'P',
            USD: () => 'D',
            EUR: () => 'E',
            CN: () => 'C',
            CD: () => 'CD',
          };

          det.currencyId = currencyId[currency]();

          this.data1.push(det);
        });

        this.data1 = [...this.data1];
        this.filterParams2.getValue().removeAllFilters();
        this.totalItems2 = this.data1.length;
      },
      error: error => {
        if (error.status == 400) {
          if (error.error.message.includes('Conciliado')) {
            this.alert('error', 'ERROR', error.error.message);
          }
        }
        this.loading = false;
        this.data1 = [];
        this.totalItems2 = 0;
        this.registers = null;
        this.files.nativeElement.value = '';
      },
    });
  }

  deleteRequest() {
    const { solnumId } = this.form.value;
    this.alertQuestion(
      'question',
      'Borrar',
      `¿Estás seguro de eliminar la solicitud numerario: ${solnumId}?`
    ).then(ans => {
      if (ans.isConfirmed) {
        this.numEncServ.remove(solnumId).subscribe({
          next: () => {
            this.alert('success', 'Solicitud', 'Ha sido eliminada');
            this.clearSearch();
          },
          error: error => {
            if (error.error.message.includes('solicitudes_nume_det')) {
              this.alert(
                'error',
                'Error',
                'No puede borrar solicitud numerario debido a que contiene solicitudes numerario detalle, favor de eliminar primero solicitudes numerario detalle'
              );
            } else {
              this.alert(
                'error',
                'Error',
                'Ha ocurrido un error al eliminar la solicitud'
              );
            }
          },
        });
      }
    });
  }
}
