/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDelegation } from 'src/app/core/models/ms-survillance/survillance';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ProtectionService } from 'src/app/core/services/ms-protection/protection.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

type SuspensionType = 'PROVISIONAL' | 'DEFINITIVA' | 'DE PLANO' | '';
@Component({
  selector: 'app-assignation-goods-protection',
  templateUrl: './assignation-goods-protection.component.html',
  styleUrls: ['./assignation-goods-protection.component.scss'],
})
export class AssignationGoodsProtectionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: false,
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
        type: 'number',
      },
      description: {
        title: '',
        sort: false,
        type: 'string',
      },
      protection: {
        title: '',
        sort: false,
        type: 'string',
      },
    },
  };
  // Data table 1
  dataTable: IGood[] = [];
  count: number = 0;
  private data: IGood[] = [];
  private data2: IGood[] = [];
  tableSettings2 = {
    actions: false,
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
      },
      description: {
        title: '',
        sort: false,
        type: 'string',
      },
    },
  };
  // Data table 2
  dataTable2: IGood[] = [];
  items = new DefaultSelect<Example>();
  minItems = new DefaultSelect<IMinpub>();
  courtItems = new DefaultSelect<ICourt>();
  delegationItems = new DefaultSelect<IDelegation>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 0;
  goodAdd: IGood;
  goodRemove: IGood;
  public form: FormGroup;
  public formAmparo: FormGroup;

  paramsDel = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsMin = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsCourt = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsExp = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private protectionService: ProtectionService,
    private router: Router,
    private delegationServ: DelegationService,
    private minService: MinPubService,
    private courtServ: CourtService,
    private route: ActivatedRoute,
    private expedientService: ExpedientService,
    private user: AuthService,
    private historyGood: HistoryGoodService
  ) {
    super();
    this.params.getValue().limit = 5;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: param => {
        const id = param.get('id');
        if (id) {
          setTimeout(() => {
            const params = new ListParams();
            params.text = id;
            this.getExpedient(params);
          }, 1000);
        }
      },
    });

    this.paramsDel
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegation(new ListParams()));
    this.paramsMin
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMin(new ListParams()));
    this.paramsCourt
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourt(new ListParams()));

    this.prepareForm();
  }

  getExpedient(params: ListParams) {
    this.paramsExp.getValue().removeAllFilters();
    this.paramsExp.getValue().page = params.page;
    if (params.text)
      this.paramsExp.getValue().addFilter('id', params.text, SearchFilter.EQ);

    this.expedientService
      .getAllFilter(this.paramsExp.getValue().getParams())
      .subscribe({
        next: resp => {
          this.expedientSelect(resp.data[0]);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.error.message;
          }
          this.onLoadToast('error', error, '');
        },
      });
  }

  getDelegation(params?: ListParams) {
    this.paramsDel.getValue().removeAllFilters();
    this.paramsDel.getValue().sortBy = 'description:ASC';
    this.paramsDel.getValue().page = params.page;
    this.paramsDel
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.delegationServ
      .getAllFiltered(this.paramsDel.getValue().getParams())
      .subscribe({
        next: resp => {
          this.delegationItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.delegationItems = new DefaultSelect();
        },
      });
  }

  getCourt(params?: ListParams) {
    this.paramsCourt.getValue().removeAllFilters();
    this.paramsCourt.getValue().page = params.page;
    this.paramsCourt.getValue().sortBy = 'description:ASC';
    this.paramsCourt
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.courtServ
      .getAllFiltered(this.paramsCourt.getValue().getParams())
      .subscribe({
        next: resp => {
          this.courtItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.courtItems = new DefaultSelect();
        },
      });
  }

  getMin(params?: ListParams) {
    this.paramsMin.getValue().removeAllFilters();
    this.paramsMin.getValue().page = params.page;
    this.paramsMin.getValue().sortBy = 'description:ASC';
    this.paramsMin
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.minService
      .getAllWithFilters(this.paramsMin.getValue().getParams())
      .subscribe({
        next: resp => {
          this.minItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.minItems = new DefaultSelect();
        },
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]], //* id
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]], // Preliminary Inquiry
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]], // Criminal Case
      protectionKey: [null],
    });
    this.formAmparo = this.fb.group({
      suspensionType: '', // Provisional, Definitiva, De plano
      reportPreviousDate: [null],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      cveProtection: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      protectionType: [null, [Validators.required]], //* Directo, Indirecto
      protectionDate: [null],
      reportJustifiedDate: [null],
      minpubNumber: [null], // Detalle Min. Pub.
      courtNumber: [null], // Detalle No Juzgado
      responsable: [null, Validators.pattern(STRING_PATTERN)],
      delegationNumber: [null], // 4 campos con el primero en id
      complainers: [null, [Validators.pattern(STRING_PATTERN)]],
      actReclaimed: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  expedientSelect(expedient: IExpedient) {
    this.minItems = new DefaultSelect<IMinpub>([], 0, true);
    this.courtItems = new DefaultSelect<ICourt>([], 0, true);
    this.delegationItems = new DefaultSelect<IDelegation>([], 0, true);
    this.formAmparo.reset();
    this.dataTable = [];
    this.dataTable2 = [];
    this.data = [];
    this.data2 = [];
    this.count = 0;
    this.form.patchValue(expedient);
    if (expedient) {
      this.params.getValue().page = 1;
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
        next: () => {
          this.getData(this.form.value);
        },
      });

      let filterParams = new FilterParams();
      filterParams.limit = 10;
      filterParams.page = 1;
      filterParams.addFilter(
        'proceedingsNumber',
        this.form.value.id,
        SearchFilter.EQ
      );
      this.protectionService
        .getAllWithFilters(filterParams.getParams())
        .subscribe({
          next: value => {
            let amparo: any = value.data[0];
            this.formAmparo.patchValue(amparo);
            if (amparo.minpubNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.minpubNumber.description;
              this.getMin(paramsD);
              this.formAmparo
                .get('minpubNumber')
                .patchValue(amparo.minpubNumber.minpubNumber);
            }
            if (amparo.delegationNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.delegationNumber.description;
              this.getDelegation(paramsD);
              this.formAmparo
                .get('delegationNumber')
                .patchValue(amparo.delegationNumber.delegationId);
            }
            if (amparo.courtNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.courtNumber.description;
              this.getCourt(paramsD);
              // this.courtItems = new DefaultSelect([amparo.courtNumber]);
              this.formAmparo
                .get('courtNumber')
                .patchValue(amparo.courtNumber.courtNumber);
            }
            // this.formTipoSuspersion.patchValue(amparo);
            this.formAmparo
              .get('suspensionType')
              .patchValue(this.setSuspensionType(amparo));
          },
        });
    }
  }

  clear() {
    this.minItems = new DefaultSelect<IMinpub>([], 0, true);
    this.courtItems = new DefaultSelect<ICourt>([], 0, true);
    this.delegationItems = new DefaultSelect<IDelegation>([], 0, true);
    this.formAmparo.reset();
    this.form.reset();
    this.dataTable = [];
    this.dataTable2 = [];
    this.data = [];
    this.data2 = [];
    this.count = 0;
  }

  private getData(val: any) {
    if (val.id) {
      this.loading = true;
      const table = document.getElementById('table').children[0].children[1];
      this.goodService
        .getByExpedient(val.id, this.params.getValue())
        .subscribe({
          next: value => {
            this.loading = false;
            this.dataTable = [...value.data];
            this.data = [...this.dataTable];
            this.count = value.count;
            value.data.map((data, i) => {
              const filter = { goodNumber: this.dataTable[i].goodId };
              this.protectionService.getByPerIds(filter).subscribe({
                next: resp => {
                  data.protection = resp.cveProtection;
                },
                error: err => {
                  data.protection = '';
                },
              });
            });

            const time1 = setTimeout(() => {
              this.dataTable = [...value.data];
              const time2 = setTimeout(() => {
                this.dataTable.map((amp, i) => {
                  amp.protection
                    ? table.children[i].classList.add('bg-danger', 'text-white')
                    : table.children[i].classList.add(
                        'bg-success',
                        'text-white'
                      );
                });
                clearTimeout(time2);
              }, 500);
              clearTimeout(time1);
            }, 1000);
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  private setSuspensionType(amparo: any): SuspensionType {
    if (amparo.suspensionfinal == 'N') {
      return 'DEFINITIVA';
    } else if (amparo.suspensionOfFlat == 'P') {
      return 'DE PLANO';
    } else if (amparo.suspensionProvisional == 'N') {
      return 'PROVISIONAL';
    } else {
      return '';
    }
  }

  mostrarInfo(): any {
    const { id } = this.form.value;
    if (id) {
      this.router.navigate(
        [`/pages/juridical/depositary/notifications-file/${id}`],
        { queryParams: { origin: 'FACTJURBIENESXAMP' } }
      );
    } else {
      this.onLoadToast(
        'info',
        'No se tiene expediente, favor de verificar.',
        ''
      );
    }
  }

  selectGoodTable1({ data, isSelected }: any) {
    if (isSelected) {
      this.goodAdd = data;
    }
  }
  selectGoodTable2({ data, isSelected }: any) {
    console.log(isSelected);

    if (isSelected) {
      this.goodRemove = data;
    }
  }

  btnAgregar() {
    const { cveProtection } = this.formAmparo.value;
    const table = document.getElementById('table').children[0].children[1];
    if (this.goodAdd.protection) {
      this.onLoadToast(
        'info',
        'Ese bien ya se encuentra en el amparo',
        this.goodAdd.protection
      );
    } else if (!cveProtection) {
      this.onLoadToast(
        'info',
        'Debe especificar o buscar el amparo para después integrar el bien',
        ''
      );
    } else {
      const user = this.user.decodeToken();
      const data = {
        goodNumber: this.goodAdd.goodId,
        cveProtection: cveProtection,
        recordDate: new Date(),
        recordUser: user.name.toUpperCase(),
      };

      this.protectionService.createPerProtection(data).subscribe({
        next: () => {
          this.onLoadToast(
            'success',
            'Recuerde que después de registrarlo ya no se puede regresar',
            ''
          );
          this.data2.push(this.goodAdd);
          const i = this.dataTable.findIndex(
            item => item.goodId === this.goodAdd.goodId
          );
          const filter = this.goodAdd.goodId;
          this.protectionService.getByPerIds({ goodNumber: filter }).subscribe({
            next: resp => {
              this.dataTable[i].protection = resp.cveProtection;
              table.children[i].classList.add('bg-danger', 'text-white');
            },
            error: err => {
              this.dataTable[i].protection = '';
              table.children[i].classList.add('bg-success', 'text-white');
            },
          });

          const time1 = setTimeout(() => {
            this.dataTable2 = [...this.data2];
            this.dataTable = [...this.dataTable];
            const time2 = setTimeout(() => {
              this.dataTable.map((amp, i) => {
                amp.protection
                  ? table.children[i].classList.add('bg-danger', 'text-white')
                  : table.children[i].classList.add('bg-success', 'text-white');
              });
              clearTimeout(time2);
            }, 500);
            clearTimeout(time1);
          }, 1000);
          this.goodAdd = null;
        },
        error: err => {
          this.onLoadToast('error', err.error.message, '');
        },
      });
    }
  }

  async btnEliminar() {
    const exist = await new Promise((resolve, reject) => {
      this.protectionService
        .getByPerIds({ goodNumber: this.goodRemove.goodId })
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: () => {
            resolve(false);
          },
        });
    });

    const { cveProtection } = this.formAmparo.value;

    if (cveProtection == null) {
      this.onLoadToast(
        'info',
        'Debe especificar o buscar el acta para después eliminar el bien de esta',
        ''
      );
    } else if (this.goodRemove.goodId == null) {
      this.onLoadToast(
        'info',
        'Debe seleccionar un bien que forme parte del amparo primero',
        ''
      );
    } else if (exist != null) {
      this.onLoadToast('info', 'No se puede eliminar un bien ya asignado', '');
    } else {
      const removed = {
        goodNumber: this.goodRemove.goodId,
        cveProtection: this.goodRemove.protection,
        recordDate: '',
      };
    }

    console.log(exist);

    // if (this.goodRemove) {
    //   this.data.push(this.goodRemove);
    //   this.data2.splice(
    //     this.data2.findIndex(item => item.id === this.goodRemove.id),
    //     1
    //   );
    //   this.dataTable = [...this.data];
    //   this.dataTable2 = [...this.data2];
    //   console.log('Eliminar');
    //   this.goodRemove = null;
    // }
  }

  async changeStatus() {
    const table = document.getElementById('table').children[0].children[1];
    const status: any = await this.checkStatus(this.goodRemove.goodId);

    if (!status) {
      this.onLoadToast('info', 'No se puede verificar estatus anterior', '');
    } else {
      let good = this.dataTable.filter(
        g => g.goodId == this.goodRemove.goodId
      )[0];
      const user = this.user.decodeToken();
      let history: IHistoryGood = {
        changeDate: new Date(),
        propertyNum: good.goodId,
        reasonForChange: 'Automatico por cancelacion de amparo',
        status: good.estatus.id,
        statusChangeProgram: 'FACTJURBIENESXAMP',
        userChange: user.name.toUpperCase(),
      };

      this.historyGood.create(history).subscribe({
        next: () => {
          const beforeStatus = this.goodRemove.status;
          this.onLoadToast(
            'success',
            `Se cambió el estatus del bien ${this.goodRemove.goodId} de ${beforeStatus} a ${status}`,
            ''
          );

          good.status = status;
          const i = this.dataTable.findIndex(
            item => item.goodId === this.goodRemove.goodId
          );

          this.dataTable[i] = good;

          const time1 = setTimeout(() => {
            this.dataTable2 = [...this.data2];
            this.dataTable = [...this.dataTable];
            const time2 = setTimeout(() => {
              this.dataTable.map((amp, i) => {
                amp.protection
                  ? table.children[i].classList.add('bg-danger', 'text-white')
                  : table.children[i].classList.add('bg-success', 'text-white');
              });
              clearTimeout(time2);
            }, 500);
            clearTimeout(time1);
          }, 1000);
        },
        error: () => {
          this.onLoadToast(
            'error',
            'No se puede actualizar el estatus del bien',
            ''
          );
        },
      });
    }
  }

  checkStatus(goodId: number) {
    return new Promise((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('propertyNum', goodId, SearchFilter.EQ);
      filter.sortBy = 'changeDate:DESC';
      this.historyGood.getAllFilter(filter.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0].status);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  callFormNumerary() {
    this.router.navigate([
      '/pages/general-processes/historical-good-situation',
    ]);
  }
}
