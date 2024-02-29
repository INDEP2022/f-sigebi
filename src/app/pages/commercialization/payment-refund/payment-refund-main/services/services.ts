import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
@Injectable({
  providedIn: 'root',
})
export class PaysService {
  constructor(
    private comerEventService: ComerEventService,
    private segAcessXAreasService: SegAcessXAreasService,
    private usersService: UsersService,
    private parametersService: ParametersService,
    private parameterModService: ParameterModService,
    private delegationService: DelegationService,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private securityService: SecurityService
  ) {}

  async getCrtlCreate(params: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.getEatCtlCreate_(params).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: error => {
          let obj = {
            data: [],
            count: 0,
          };
          resolve(obj);
        },
      });
    });
  }

  async createEatCtlCreate_(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.createEatCtlCreate_(params).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  async putEatCtlCreate_(params: any, user: string) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.putEatCtlCreate_(params, user).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  async deleteCrtlCreate(params: any, user: string) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService
        .deleteEatCtlCreate_(params, user)
        .subscribe({
          next: (res: any) => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
    });
  }

  async segUsers(params: any) {
    return new Promise((resolve, reject) => {
      this.usersService.getAllSegUsers(params).subscribe({
        next: (res: any) => {
          resolve(res.data[0]);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  async segUsersAll(params: any) {
    return new Promise((resolve, reject) => {
      this.usersService.getAllSegUsers(params).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: error => {
          let obj = {
            data: [],
            count: 0,
          };
          resolve(obj);
        },
      });
    });
  }

  getCtlDevPagP(params: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.getCtlDevPagP(params).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: error => {
          let res = {
            data: [],
            count: 0,
          };
          resolve(res);
        },
      });
    });
  }
  getvwComerPaymenttobeReturned(params) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService
        .getvwComerPaymenttobeReturned(params)
        .subscribe({
          next: (res: any) => {
            resolve(res.data[0]);
          },
          error: error => {
            resolve(null);
          },
        });
    });
  }
}
