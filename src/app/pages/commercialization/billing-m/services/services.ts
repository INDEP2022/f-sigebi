import { Injectable } from '@angular/core';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { ComerDetailInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-dinvocie.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
@Injectable({
  providedIn: 'root',
})
export class BillingsService {
  constructor(
    private msInvoiceService: MsInvoiceService,
    private lotService: LotService,
    private comerEventService: ComerEventService,
    private segAcessXAreasService: SegAcessXAreasService,
    private parametersService: ParametersService,
    private parameterModService: ParameterModService,
    private delegationService: DelegationService,
    private dinamicTablesService: DinamicTablesService,
    private comerInvoice: ComerInvoiceService,
    private comerDetailInvoiceService: ComerDetailInvoiceService
  ) {}

  async getEventDataById(id: any) {
    // COMER_EVENTOS
    const params = new FilterParams();
    params.addFilter('id', id, SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.comerEventService.getAllFilter(params.getParams()).subscribe({
        next: data => {
          resolve(data.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getApplicationLotCounter(body: any) {
    // CONTADOR
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationLotCounter(body).subscribe({
        next: data => {
          resolve(data.data[0].counter);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async getApplicationBugInfoCounter(body: any) {
    // CONTADOR
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationBugInfoCounter(body).subscribe({
        next: data => {
          resolve(data.data[0].counter);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async getApplicationNofactCounter(body: any) {
    // CONT_NOFACT
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationNofactCounter(body).subscribe({
        next: data => {
          resolve(data.data[0].cont_nofact);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async getApplicationCounter1(body: any) {
    // CONTADOR1
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationCounter1(body).subscribe({
        next: data => {
          resolve(data.data[0].counter);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async paNewBillingPay(body: any) {
    // PK_COMER_FACTINM.PA_NVO_FACTURA_PAG
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getPaNvoFacturaPag(body).subscribe({
        next: data => {
          console.log('da1', data);
          resolve(data.data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getEatEstLot(params: any) {
    // COMER_EST_LOTES
    return new Promise((resolve, reject) => {
      this.lotService.getEatEstLot(params).subscribe({
        next: response => {
          resolve(response);
          console.log(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async pupActStatusBatch(event: any) {
    // COMER_EST_LOTES
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getPupActstatusLot(event).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getFValidateUser(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getFValidateUser(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async pufUsuReg(body: any) {
    // CORREGIR
    return new Promise((resolve, reject) => {
      this.parameterModService.f_validUser(body).subscribe({
        next: response => {
          resolve('S');
        },
        error: error => {
          resolve('N');
        },
      });
    });
  }

  async getPaNvoDeleteInvoice(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getPaNvoDeleteInvoice(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async comerCtrFacRegxBatch(body: any) {
    // COMER_CTRLFACTURA.REGXLOTE
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getCtrlInvoiceRegLot(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getSegAcessXAreasService(params: any) {
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll(params).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // ------------------ Valida y selecciona // Arreglar endpoints // Start ------------------ //

  async cursor1(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getCursor1(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve([]);
        },
      });
    });
  }

  async cursor2(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getCursor2(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          resolve([]);
        },
      });
    });
  }

  async valueContador(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .getApplicationValidSelectionCountfact(body)
        .subscribe({
          next: response => {
            resolve(response.data[0].ncount);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  async valueContador1(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .getApplicationValidSelectionCountfactFol(body)
        .subscribe({
          next: response => {
            resolve(response.data[0].ncount);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  // ------------------ ------------------  // End // ------------------ ------------------ //

  async paNewGeneratePay(body: any) {
    // PK_COMER_FACTINM.PA_NVO_GENERA_NC
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getPaNvoGenerarPag(body).subscribe({
        next: data => {
          console.log('da1', data);
          resolve(data.data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getParamaters(params: any) {
    return new Promise((resolve, reject) => {
      this.parametersService.getAll(params).subscribe({
        next: data => {
          resolve(data.data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getBillings(params: any) {
    // Facturas - COMER_FACTURAS - OBTENER
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getAllBillings(params).subscribe({
        next: response => {
          resolve(response);
          console.log(response);
        },
        error: error => {
          resolve({ count: 0 });
        },
      });
    });
  }
  async updateBillings(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.updateBillings(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }
  async getLots(params: any) {
    return new Promise((resolve, reject) => {
      this.lotService.getLotbyEvent_(params).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve({ count: 0 });
        },
      });
    });
  }

  async getProcFailed(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getProcFailed(body).subscribe({
        next: data => {
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getConsFailed(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getConsFailed(body).subscribe({
        next: data => {
          resolve(data.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getEatInconsistences(params: any) {
    // COMER_INCONSISTENCIAS
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getInconsistencies_(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getApplicationConsPupEminFactFunct(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationConsPupEminFact(body).subscribe({
        next: response => {
          resolve(response.data[0].n_MAX_PARC);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getPaDeleteFac(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationConsPupEminFact(body).subscribe({
        // CAMBIAR ENDPOINT
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  async getDelegation(params: any) {
    // CAT_DELEGACIONES
    return new Promise((resolve, reject) => {
      this.delegationService.getAll2(params).subscribe({
        next: async (response: any) => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getComerTpinvoices(params: any) {
    // COMER_TPFACTURAS
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getComerTpinvoices(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  async getApplicationFaValidCurpRfc(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationFaValidCurpRfc(body).subscribe({
        next: response => {
          resolve(response.data[0].faValidCurpRfc);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // ============================================================================== //

  async getApplicationComerBillsTotal(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationComerBillsTotal(body).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          let objReturn = {
            totaling: 0,
            totaleg: 0,
          };
          resolve(objReturn);
        },
      });
    });
  }

  async getApplicationComerBillsIva(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationComerBillsIva(body).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          let objReturn = {
            ivaing: 0,
            ivaeg: 0,
          };
          resolve(objReturn);
        },
      });
    });
  }

  async getApplicationComerBillsPrice(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationComerBillsPrice(body).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          let objReturn = {
            priceing: 0,
            priceeg: 0,
          };
          resolve(objReturn);
        },
      });
    });
  }

  async getApplicationComerBillsAmount(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationComerBillsAmount(body).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getParamterMod(params: any) {
    return new Promise((resolve, reject) => {
      this.parameterModService.getParamterMod(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // ============================================================================== //

  async getKeyTable(params: any, name: string) {
    return new Promise((resolve, reject) => {
      this.dinamicTablesService.getKeyTable(params, name).subscribe({
        next: response => {
          let result = response.data.map((item: any) => {
            item['cveAndDesc'] = item.clave + ' - ' + item.descripcion;
          });

          Promise.all(result).then(resp => {
            resolve(response);
          });
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getApplicationGenerateFolio(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationGenerateFolio(body).subscribe({
        next: response => {
          let obj = {
            msg: response.data[0],
            status: 200,
          };
          resolve(obj);
        },
        error: error => {
          let obj = {
            msg: error.error.message,
            status: error.status,
          };
          resolve(obj);
        },
      });
    });
  }

  async getApplicationGetCountSumbyTypes(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.getApplicationGetCountSumbyTypes(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve({
            contador: 0,
            suma: 0,
          });
        },
      });
    });
  }
  async getSumTotal(body: any) {
    return new Promise((resolve, reject) => {
      this.comerInvoice.getSumTotal(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async updateDetBillings(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailInvoiceService.update(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  getCountBatch(event: number, batch: number) {
    return new Promise((resolve, reject) => {
      this.comerInvoice.getCountBatch(event, batch).subscribe({
        next: response => {
          resolve(response.contador);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  getApplicationGetCountbyMandatoin(event: number, batch: number) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .getApplicationGetCountbyMandatoin(event, batch)
        .subscribe({
          next: response => {
            resolve(response.contador);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  getApplicationGetCountbyMandatoNotin(event: number, batch: number) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .getApplicationGetCountbyMandatoNotin(event, batch)
        .subscribe({
          next: response => {
            resolve(response.contador);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }
  getApplicationGetCount1GenXpago(event: number, batch: number) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .getApplicationGetCount1GenXpago(event, batch)
        .subscribe({
          next: response => {
            resolve(response.contador);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  deleteApplicationDeleteIfExists(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.deleteApplicationDeleteIfExists(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  putApplicationComerBillsAmount(body: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService.putApplicationComerBillsAmount(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }
}
