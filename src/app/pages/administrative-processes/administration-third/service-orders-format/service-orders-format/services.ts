import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStrategyProcess } from 'src/app/core/models/ms-strategy-process/strategy-process.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
@Injectable({
  providedIn: 'root',
})
export class ServiceFormatService {
  constructor(
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private rNomenclaService: RNomenclaService,
    private delegationService: DelegationService,
    private strategyProcessService: StrategyProcessService,
    private thirdPartyService: ThirdPartyService
  ) {}

  async countFormatService(params: ListParams): Promise<number> {
    return new Promise((resolve, reject) => {
      this.goodPosessionThirdpartyService.getAllStrategyV2(params).subscribe({
        next: response => {
          resolve(response.count | 0);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async getrNomencla(
    params: ListParams
  ): Promise<{ data: any; count: number }> {
    return new Promise((resolve, reject) => {
      this.rNomenclaService.getAll(params).subscribe({
        next: async (data: any) => {
          resolve({ data: data.data[0], count: data.count });
        },
        error: async error => {
          resolve({ data: null, count: 0 });
        },
      });
    });
  }

  async getCatDelegation(params: ListParams): Promise<IDelegation | null> {
    return new Promise((resolve, reject) => {
      this.delegationService.getAllPaginated(params).subscribe({
        next: data => {
          resolve(data.data[0]);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getProcess(params: ListParams): Promise<IStrategyProcess | null> {
    return new Promise((resolve, reject) => {
      this.strategyProcessService.getAll(params).subscribe({
        next: value => {
          resolve(value.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  //
  async getStrategyService(
    numberProcess: number | string,
    params: ListParams
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getLOV_SERVICIOS(numberProcess, params).subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['idAndDesc'] = item.serviceNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }
  async getStrategyServiceType(
    body: any,
    params: ListParams
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getLOV_TIPOSERVI(body, params).subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['idAndDesc'] =
              item.serviceTypeNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }
  async getTurnNumber(
    body: any,
    params: ListParams
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getLOV_TURNO(body, params).subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['idAndDesc'] = item.turnNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }

  async getVarCostNumber(
    body: any,
    params: ListParams
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getLOV_VARCOSTO(body, params).subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['idAndDesc'] = item.varCostNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }

  async getLOV_CAT3NIVELES(
    params: ListParams
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getLOV_CAT3NIVELES(params).subscribe({
        next: value => {
          let result = value.data.map(item => {
            // item['idAndDesc'] = item.varCostNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }

  async createStrategyImport(params: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.goodPosessionThirdpartyService
        .createStrategyImport(params)
        .subscribe({
          next: response => {
            resolve(200);
          },
          error: err => {
            resolve(err.status);
          },
        });
    });
  }

  async updateStrategyImport(params: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.goodPosessionThirdpartyService
        .updateStrategyImport(params)
        .subscribe({
          next: response => {
            resolve(200);
          },
          error: err => {
            resolve(err.status);
          },
        });
    });
  }
  async getQueryVtransferoLevelXcity(
    body: any
  ): Promise<{ data: Array<any>; count: number }> {
    return new Promise((resolve, reject) => {
      this.thirdPartyService.getQueryVtransferoLevelXcity(body).subscribe({
        next: value => {
          let result = value.data.map(item => {
            // item['idAndDesc'] = item.varCostNumber + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            resolve({ data: value.data, count: value.count });
          });
        },
        error: err => {
          resolve({ data: [], count: 0 });
        },
      });
    });
  }
  async deleteStrategyImport(params: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.goodPosessionThirdpartyService
        .deleteStrategyImport(params)
        .subscribe({
          next: response => {
            resolve(200);
          },
          error: err => {
            resolve(err.status);
          },
        });
    });
  }

  async getStrategyCost(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.strategyProcessService.getStrategyCost(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async createBitacora(body: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.goodPosessionThirdpartyService.posStrategyBitacora(body).subscribe({
        next: response => {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }
}
