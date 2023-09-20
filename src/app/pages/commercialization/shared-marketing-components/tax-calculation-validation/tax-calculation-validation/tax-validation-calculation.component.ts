import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { InconsistenciesComponent } from '../inconsistencies/inconsistencies.component';
import { RateChangeComponent } from '../rate-change/rate-change.component';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { ComerGoodsRejectedService } from 'src/app/core/services/ms-prepareevent/comer-goods-rejected.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { ExpenseParametercomerService } from '../../expense-capture/services/expense-parametercomer.service';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-tax-validation-calculation',
  templateUrl: './tax-validation-calculation.component.html',
  styles: [],
})
export class TaxValidationCalculationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  avaluos: any[] = [];

  DIRECCION: 'I';

  TIPO_PROCESO: any;
  V_WHERE_IDAVALUO: any;

  V_IVA: any;
  V_NO_COLUM: any;

  V_TMPBIENES_ERROR: any;
  V_TMPAVALUO_ERROR: any;

  columnFilters: any = [];

  settings2 = { ...this.settings, actions: false };
  data2: LocalDataSource = new LocalDataSource();
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  Detavaluos: any[] = [];

  appraisal: any;
  V_VRI: number;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private expenseParametercomerService: ExpenseParametercomerService,
    private authService: AuthService,
    private comerGoodsRejectedService: ComerGoodsRejectedService,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private officeManagementService: OfficeManagementService,
    private appraiseService: AppraiseService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    console.log('RespSubstr ->', this.Substr('14.6'));
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.getValueIva();

    this.filterTable();
    //let token = this.authService.decodeToken();
    let token = 'JBUSTOS';
    if (token == 'JBUSTOS') {
      //Activar botón Confirmar
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      processKey: [null],
      eventDate: [null],
      observations: [null],
      requestDate: [null],
      requestType: [null],
      status: [null],
      reference: [null],
    });
  }

  openModalRateChange(context?: Partial<RateChangeComponent>): void {
    const modalRef = this.modalService.show(RateChangeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      //if (data)
    });
  }

  openModalInconsistencies(context?: Partial<InconsistenciesComponent>): void {
    const modalRef = this.modalService.show(InconsistenciesComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  getValueIva() {
    this.expenseParametercomerService.getParameterMod().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getValueIva-> ', resp);
          this.V_IVA = '0.' + resp.data[0].value;
          console.log('this.V_IVA-> ', this.V_IVA);
        }
      },
      error => {
        console.log('Error al obtener el valor del IVA. ');
      }
    );
  }

  search() {
    this.getComerEvent(this.form.get('eventId').value);

    this.form.get('processKey').patchValue(null);
    this.form.get('eventDate').patchValue(null);
    this.form.get('observations').patchValue(null);
    this.form.get('requestDate').patchValue(null);
    this.form.get('requestType').patchValue(null);
    this.form.get('status').patchValue(null);
    this.form.get('reference').patchValue(null);
  }

  getComerEvent(idEvent: number) {
    this.comerGoodsRejectedService.getComerEvent('I', idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerEvent-> ', resp);
          this.getComerTpEvent(idEvent);
          this.getComerStatusVta(resp.data[0].statusVtaId);
          this.getComerParameterMod(
            idEvent,
            resp.data[0].address,
            resp.data[0].tpsolavalId
          );
          this.getComerJobs(idEvent);
        }
      },
      error => {
        console.log('Error getComerEvent-> ', error);
      }
    );
  }

  getComerTpEvent(idEvent: number) {
    this.comerUsuauTxEventService.getComerTpEvent(idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerTpEvent-> ', resp);
          this.form.get('requestType').patchValue(resp.data[0].description);
        } else {
          this.form.get('requestType').setValue(null);
        }
      },
      error => {
        console.log('Error getComerTpEvent-> ', error);
      }
    );
  }

  getComerStatusVta(statusVta: string) {
    this.expenseParametercomerService.getComerStatusVta(statusVta).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getComerStatusVta-> ', resp);
          this.form.get('status').patchValue(resp.data[0].description);
        } else {
          this.form.get('status').setValue(null);
        }
      },
      error => {
        console.log('Error getComerStatusVta-> ', error);
      }
    );
  }

  getComerParameterMod(idEvent: number, address: string, tpsolavalId: any) {
    this.expenseParametercomerService
      .getComerParameterMod(idEvent, address, tpsolavalId, 'TP_SOL_AVAL')
      .subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp ComerParameterMod-> ', resp);
            this.form.get('reference').patchValue(resp.data[0].description);
          } else {
            this.form.get('reference').setValue(null);
          }
        },
        error => {
          console.log('Error ComerParameterMod-> ', error);
        }
      );
  }

  getComerJobs(idEvent: number) {
    this.officeManagementService.getComerJobs(1, idEvent).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp ComerJobs', resp);
          this.form
            .get('requestDate')
            .patchValue(this.formatDate(new Date(resp.data[0].sendDate)));
        } else {
          this.form.get('requestDate').setValue(null);
        }
      },
      error => {
        console.log('error ComerJobs-> ', error);
      }
    );
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getComerAvaluo() {
    this.avaluos = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //?filter.type=$eq:${type}
    params['filter.type'] = `$eq:I`;
    console.log('params 1 -> ', params);
    this.appraiseService.getComerAvaluo(params).subscribe(
      resp => {
        console.log('Resp comerAvaluo', resp);
        for (let i = 0; i < resp.count; i++) {
          if (resp.data[i] != null && resp.data[i] != undefined) {
            let params = {
              id: resp.data[i].id,
              appraisalKey: resp.data[i].appraisalKey,
              cveOffice: resp.data[i].cveOffice,
              insertDate: this.formatDate(new Date(resp.data[i].insertDate)),
              idEvent: resp.data[i].idEvent,
              noDelegation: resp.data[i].noDelegation,
              noRegister: resp.data[i].noRegister,
              type: resp.data[i].type,
              userInsert: resp.data[i].userInsert,
            };
            this.avaluos.push(params);
            this.data.load(this.avaluos);
            this.data.refresh();
            this.totalItems = resp.count;

            this.appraisal = resp.data[i].id;

            this.getComerDetAvaluo(resp.data[i].id);
          }
        }
      },
      error => {
        console.log('Error comerAvaluo-> ', error);
      }
    );
  }

  filterTable() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                field = 'filter.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'valueKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fileKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateInsert':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getComerAvaluo();
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerAvaluo());
  }

  getComerDetAvaluo(appraisal: number) {
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    let v_porcen_aux: any;
    let v_proc_a: number;
    let v_proc_b: number;
    let v_proc_c: number;
    let v_proc_d: number;
    let v_proc_e: number;
    let v_proc_aux: number;

    let terrainRate: any;
    let terrainIva: any;

    let v_mascara_terreno: string;

    let rateHousing: any;
    let ivaHousing: any;
    let v_mascara_habit: string;

    let rateCommercial: any;
    let ivaCommercial: any;
    let v_mascara_comer: string;
    this.appraiseService.getComerDetAvaluo(appraisal, 'CPV', params2).subscribe(
      resp => {
        console.log('Resp ComerDetAvaluo-> ', resp);
        for (let i = 0; i < resp.count; i++) {
          if (resp != null && resp != undefined) {
            /**INICIO pupValidaReg */
            this.V_VRI =
              Number(this.nvl(resp.data[i].vTerrain)) +
              Number(this.nvl(resp.data[i].vConstruction)) +
              Number(this.nvl(resp.data[i].vConstructionEat)) +
              Number(this.nvl(resp.data[i].vInstallationsEsp)) +
              Number(this.nvl(resp.data[i].vOthers));
            /** Mapeo de campos operacion servicio Tabla */
            let porcentTerrain = this.roundPercentage(
              (resp.data[i].vTerrain * 100) / resp.data[i].vri
            );

            let porcentHousing = this.roundPercentage(
              (resp.data[i].vConstruction * 100) / resp.data[i].vri
            );

            let porcentCommercial = this.roundPercentage(
              (resp.data[i].vConstructionEat * 100) / resp.data[i].vri
            );

            let porcentSpecial = this.roundPercentage(
              (resp.data[i].vInstallationsEsp * 100) / resp.data[i].vri
            );

            let porcentOthers = this.roundPercentage(
              (resp.data[i].vOthers * 100) / resp.data[i].vri
            );

            console.log('Params SalidaRound-> ', porcentTerrain);
            console.log('Params SalidaRound2-> ', porcentHousing);
            console.log('Params SalidaRound3-> ', porcentCommercial);

            /**------------------ */
            let porcentTotal =
              porcentTerrain +
              porcentHousing +
              porcentCommercial +
              porcentSpecial +
              porcentOthers;

            if (porcentTotal > 100) {
              v_porcen_aux = porcentTotal - 100;
              if (this.nvl(porcentCommercial) > 0) {
                v_proc_a = porcentCommercial;
              }
              if (this.nvl(porcentHousing) > 0) {
                v_proc_b = porcentHousing;
              }
              if (this.nvl(porcentSpecial)) {
                v_proc_c = porcentSpecial;
              }
              if (this.nvl(porcentOthers)) {
                v_proc_d = porcentOthers;
              }
              if (this.nvl(porcentTerrain)) {
                v_proc_e = porcentTerrain;
              }

              v_proc_aux = v_proc_a;

              if (v_proc_b >= v_proc_aux) {
                v_proc_aux = v_proc_b;
              } else if (v_proc_c >= v_proc_aux) {
                v_proc_aux = v_proc_c;
              } else if (v_proc_d >= v_proc_aux) {
                v_proc_aux = v_proc_d;
              } else if (v_proc_e >= v_proc_aux) {
                v_proc_aux = v_proc_e;
              }

              /**Asignación porcentual del de mayor peso porcentual,  según la siguiente secuencia  (comercial, habitacional, especial, otros, terreno) */
              if (porcentCommercial == v_proc_aux) {
                porcentCommercial = porcentCommercial - v_porcen_aux;
              } else if (porcentSpecial == v_proc_aux) {
                porcentSpecial = porcentSpecial - v_porcen_aux;
              } else if (porcentOthers == v_proc_aux) {
                porcentOthers = porcentOthers - v_porcen_aux;
              } else if (porcentHousing == v_proc_aux) {
                porcentHousing = porcentHousing - v_porcen_aux;
              } else {
                porcentTerrain = porcentTerrain - v_porcen_aux;
              }

              porcentOthers =
                porcentTerrain +
                porcentCommercial +
                porcentHousing +
                porcentSpecial +
                porcentOthers;
            } else if (porcentTotal < 100) {
              v_porcen_aux = 100 - porcentTotal;
              if (porcentCommercial == 0) {
                if (porcentSpecial == 0) {
                  if (porcentOthers == 0) {
                    if (porcentOthers == 0) {
                      porcentTerrain = porcentTerrain + v_porcen_aux;
                    } else {
                      porcentHousing = porcentHousing + v_porcen_aux;
                    }
                  } else {
                    porcentOthers = porcentOthers + v_porcen_aux;
                  }
                } else {
                  porcentSpecial = porcentSpecial + v_porcen_aux;
                }
              } else {
                porcentCommercial = porcentCommercial + v_porcen_aux;
              }
              porcentOthers =
                porcentTerrain +
                porcentHousing +
                porcentCommercial +
                porcentSpecial +
                porcentOthers;
            }

            /**Información convertida a caracter por incluir en su caso leyenda (Para terreno). */
            if (resp.data[i].rateIvaTerrain == null) {
              terrainRate = 'EXENTO';
              terrainIva = 'N/A';
            } else {
              terrainRate = String(resp.data[i].rateIvaTerrain * 100);
              v_mascara_terreno = String(
                this.roundPercentage(
                  this.nvl(
                    (porcentTerrain / 100) *
                      resp.data[i].rateIvaTerrain *
                      this.V_VRI
                  )
                )
              );

              if (this.Substr(v_mascara_terreno)) {
              } else {
                terrainIva = v_mascara_terreno;
              }

              /**Información convertida a caracter por incluir en su caso leyenda (Para habitacional). */
              if (resp.data[i].rateIvaConstrHab == null) {
                rateHousing = 'EXENTO';
                ivaHousing = 'N/A';
              } else {
                rateHousing = String(resp.data[i].rateIvaConstrHab * 100);
                v_mascara_habit = String(
                  this.roundPercentage(
                    this.nvl(porcentHousing / 100) *
                      resp.data[i].rateIvaConstrHab *
                      this.V_VRI
                  )
                );

                if (this.Substr(v_mascara_habit)) {
                } else {
                  ivaHousing = v_mascara_habit;
                }
              }

              /**Información convertida a caracter por incluir en su caso leyenda (Para construción comercial). */
              if (resp.data[i].rateIvaConstrEat == null) {
                rateCommercial = 'EXENTO';
                ivaCommercial = 'N/A';
              } else {
                rateCommercial = String(resp.data[i].rateIvaConstrEat * 100);
                v_mascara_comer = String(
                  this.roundPercentage(
                    this.nvl(porcentCommercial / 100) *
                      resp.data[i].rateIvaConstrEat *
                      this.V_VRI
                  )
                );

                if (this.Substr(v_mascara_comer)) {
                } else {
                  ivaCommercial = v_mascara_comer;
                }
              }
            }
            /**FINAL pupValidaReg */
            let params2 = {
              idDetAppraisal: resp.data[i].idDetAppraisal,
              goodId: resp.data[i].good.goodId,
              description: resp.data[i].good.description,
              status: resp.data[i].good.status,
              goodClassNumber: resp.data[i].good.goodClassNumber,
              //typeGood:
              appraisalDate: this.formatDate(
                new Date(resp.data[i].appraisalDate)
              ),
              vigAppraisalDate: this.formatDate(
                new Date(resp.data[i].good.appraisalVigDate)
              ),
              nameAppraiser: resp.data[i].nameAppraiser,
              refAppraisal: resp.data[i].refAppraisal,
              //terrainSurface:
              //surfaceConstru:
              terrainPorcentage: porcentTerrain,
              porcentageHousing: porcentHousing,
              porcentageCommercial: porcentCommercial,
              porcentageSpecials: porcentSpecial,
              porcentageOthers: porcentOthers,
              porcentageTotal: porcentTotal,
              vri: resp.data[i].vri,
              vTerrain: resp.data[i].vTerrain,
              vConstruction: resp.data[i].vConstruction,
              vConstructionEat: resp.data[i].vConstructionEat,
              vInstallationsEsp: resp.data[i].vInstallationsEsp,
              vOthers: resp.data[i].vOthers,
              /*product: 
                difference:
                terrainRate: terrainRate,
                rateHousing:
                rateCommercial:
                rateSpecials:
                rateOthers:
                terrainIva: terrainIva,
                ivaHousing:
                ivaCommercial:
                ivaSpecial:
                ivaOthers:
                valueIvaTotalCalculated:
                totalAccount:
                observation:*/
            };
            this.avaluos.push(params2);
            this.data2.load(this.Detavaluos);
            this.data2.refresh();
            this.totalItems2 = resp.count;
          }
        }
      },
      error => {
        console.log('Error ComerDetAvaluo-> ', error);
      }
    );
  }

  /*filterTable2() {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'idDetAppraisal':
                field = 'filter.idDetAppraisal';
                searchFilter = SearchFilter.EQ;
                break;
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'goodClassNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getComerDetAvaluo(this.appraisal);
          let i = 0;
          console.log('entra ', i++);
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerDetAvaluo(this.appraisal));
  }*/

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(2));
  }

  nvl(valor?: number): number {
    if (valor != null) {
      return valor;
    } else {
      return 0;
    }
  }

  Substr(cadena: string) {
    // Obtener los dos últimos caracteres de la cadena
    let ultimosDosCaracteres = cadena.slice(-2);
    let cadenaSinUltimosDos = cadena.slice(0, -2);
    // Verificar si los dos últimos caracteres son un número del 1 al 9
    console.log('SUBSTR-> ', ultimosDosCaracteres);

    //return {ultimosDosCaracteres, cadenaSinUltimosDos};
    if (ultimosDosCaracteres == '.1') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.2') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.3') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.4') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.5') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.6') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.7') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.8') {
      cadenaSinUltimosDos + '0';
      return cadenaSinUltimosDos;
    } else if (ultimosDosCaracteres == '.9') {
      cadenaSinUltimosDos + '0';
      console.log('Else if-> ', cadenaSinUltimosDos + '0');
      return cadenaSinUltimosDos;
    } else {
      return cadena;
    }
  }
}
