import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { UserEndpoints } from 'src/app/common/constants/endpoints/ms-users-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import {
  ITransferente,
  ITransferingLevelView,
} from 'src/app/core/models/catalogs/transferente.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { ConvertiongoodEndpoints } from '../../../common/constants/endpoints/ms-convertiongood-endpoints';
import { DocumentsEndpoints } from '../../../common/constants/endpoints/ms-documents-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { ICity } from '../../models/catalogs/city.model';
import { IIndiciados } from '../../models/catalogs/indiciados.model';
import { IDocuments } from '../../models/ms-documents/documents';
import { IUserAccessAreaRelational } from '../../models/ms-users/seg-access-area-relational.model';
import { AuthorityService } from '../catalogs/authority.service';
import { CourtService } from '../catalogs/court.service';
import { DelegationService } from '../catalogs/delegation.service';
import { DepartamentService } from '../catalogs/departament.service';
import { IdentifierService } from '../catalogs/identifier.service';
import { IndiciadosService } from '../catalogs/indiciados.service';
import { MinPubService } from '../catalogs/minpub.service';
import { StationService } from '../catalogs/station.service';
import { TransferenteService } from '../catalogs/transferente.service';
import { DynamicTablesService } from '../dynamic-catalogs/dynamic-tables.service';
import { RTdictaAarusrService } from '../ms-convertiongood/r-tdicta-aarusr.service';
import { GoodParametersService } from '../ms-good-parameters/good-parameters.service';
import { ProcedureManagementService } from '../proceduremanagement/proceduremanagement.service';

@Injectable({
  providedIn: 'root',
})
export class DocReceptionRegisterService extends HttpService {
  microsevice: string = '';
  constructor(
    private delegationService: DelegationService,
    private cityRepository: Repository<ICity>,
    private dynamicTablesService: DynamicTablesService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private minPubService: MinPubService,
    private courtService: CourtService,
    private procedureManageService: ProcedureManagementService,
    private indiciadosService: IndiciadosService,
    private goodParametersService: GoodParametersService,
    private departamentService: DepartamentService,
    private identifierService: IdentifierService,
    private courtsService: CourtByCityService,
    private userCheckService: RTdictaAarusrService
  ) {
    super();
  }

  getStations(params?: string): Observable<IListResponse<IStation>> {
    let partials = ENDPOINT_LINKS.Station.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IStation>>(partials[1], params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(s => {
            return { ...s, nameAndId: `${s.id} - ${s.stationName}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.stationName < b.stationName ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getAuthorities(params?: string): Observable<IListResponse<IAuthority>> {
    let partials = ENDPOINT_LINKS.Authority.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IAuthority>>(partials[1], params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(a => {
            return { ...a, nameAndId: `${a.idAuthority} - ${a.authorityName}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.authorityName < b.authorityName ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getPublicMinistries(params?: string): Observable<IListResponse<IMinpub>> {
    let partials = ENDPOINT_LINKS.MinPub.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IMinpub>>(partials[1], params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(m => {
            return { ...m, nameAndId: `${m.id} - ${m.description}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.description < b.description ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getIdentifiers(params?: string): Observable<IListResponse<IIdentifier>> {
    let partials = ENDPOINT_LINKS.Identifier.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IIdentifier>>(partials[1], params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(i => {
            return { ...i, nameAndId: `${i.id} - ${i.description}` };
          }),
        };
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getTransferents(params?: string): Observable<IListResponse<ITransferente>> {
    let partials = ENDPOINT_LINKS.Transferente.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<ITransferente>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getActiveTransferents(body: {
    active: string[];
    nameTransferent: string;
  }): Observable<IListResponse<ITransferente>> {
    let partials = ENDPOINT_LINKS.Transferente.split('/');
    this.microservice = partials[0];
    const route = `transferent/active/not-in`;
    return this.post<IListResponse<ITransferente>>(route, body).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(t => {
            return { ...t, nameAndId: `${t.id} - ${t.nameTransferent}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.nameTransferent < b.nameTransferent ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getDepartaments(
    self?: DocReceptionRegisterService,
    params?: string
  ): Observable<IListResponse<IDepartment>> {
    let partials = ENDPOINT_LINKS.Departament.split('/');
    self.microservice = partials[0];
    return self
      .get<IListResponse<IDepartment>>(partials[1], params)
      .pipe(tap(() => (this.microservice = '')));
  }

  getDepartamentsFiltered(
    params?: string
  ): Observable<IListResponse<IDepartment>> {
    let partials = ENDPOINT_LINKS.Departament.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IDepartment>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getAffairs(
    self?: DocReceptionRegisterService,
    params?: string
  ): Observable<IListResponse<IAffair>> {
    let partials = ENDPOINT_LINKS.Affair.split('/');
    self.microservice = partials[0];
    return self
      .get<IListResponse<IAffair>>(partials[1], params)
      .pipe(tap(() => (this.microservice = '')));
  }

  getAffairsFiltered(params?: string): Observable<IListResponse<IAffair>> {
    let partials = ENDPOINT_LINKS.Affair.split('/');
    this.microservice = partials[0];
    return this.get<IListResponse<IAffair>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getManagementAreasFiltered(params?: string) {
    return this.procedureManageService.getManagementAreasFiltered(params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(a => {
            return { ...a, nameAndId: `${a.id} - ${a.description}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.description < b.description ? -1 : 1;
        });
        return data;
      })
    );
  }

  getUsersSegAreas(
    params?: string
  ): Observable<IListResponse<IUserAccessAreaRelational>> {
    this.microservice = UserEndpoints.BasePath;
    return this.get<IListResponse<IUserAccessAreaRelational>>(
      UserEndpoints.SegAccessAreas,
      params
    ).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(u => {
            return { ...u, userAndName: `${u.user} - ${u.userDetail.name}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.user < b.user ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getUniqueKeyData(
    params?: string
  ): Observable<IListResponse<ITransferingLevelView>> {
    let partials = ENDPOINT_LINKS.Transferente.split('/');
    this.microservice = partials[0];
    const route = `${partials[1]}/transferring-levels-view`;
    return this.get<IListResponse<ITransferingLevelView>>(route, params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getUniqueKeyDataModal(
    self?: DocReceptionRegisterService,
    params?: string
  ): Observable<IListResponse<ITransferingLevelView>> {
    let partials = ENDPOINT_LINKS.Transferente.split('/');
    self.microservice = partials[0];
    const route = `${partials[1]}/transferring-levels-view`;
    return self.get<IListResponse<ITransferingLevelView>>(route, params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(e => {
            return {
              ...e,
              cityDesc: `${e.cityNum} - ${e.cityDesc}`,
              federalEntityDesc: `${e.federalEntityCve} - ${e.federalEntityDesc}`,
              transfereeDesc: `${e.transfereeNum} - ${e.transfereeDesc}`,
              stationDesc: `${e.stationNum} - ${e.stationDesc}`,
              authorityDesc: `${e.authorityNum} - ${e.authorityDesc}`,
            };
          }),
        };
        return data;
      }),
      tap(() => (self.microservice = ''))
    );
  }

  getGoods(params?: string): Observable<IListResponse<IGood>> {
    this.microservice = GoodEndpoints.Good;
    return this.get<IListResponse<IGood>>(GoodEndpoints.Good, params).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  updateGood(body: Partial<IGood>): Observable<IGood> {
    this.microservice = GoodEndpoints.Good;
    return this.put(GoodEndpoints.Good, body).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  deleteGoodByExpedient(expedient: number) {
    return this.delete(`${GoodEndpoints.DeleteByExpedient}/${expedient}`);
  }

  getUserOfficePermission(body: {
    toolbarUser: string;
  }): Observable<{ val_usr: number }> {
    this.microservice = ConvertiongoodEndpoints.Convertiongood;
    return this.post<{ val_usr: string }>(`query/toolbar-usuario`, body).pipe(
      map(resp => {
        return { val_usr: Number(resp.val_usr) };
      }),
      tap(() => {
        this.microservice = '';
      })
    );
  }

  getUserByDelegation(
    delegation: number
  ): Observable<{ user: string; name: string }> {
    this.microservice = UserEndpoints.BasePath;
    return this.get(`${UserEndpoints.GetUserName}/${delegation}`).pipe(
      tap(() => (this.microservice = ''))
    );
  }

  getDocuments(
    self?: DocReceptionRegisterService,
    params?: string
  ): Observable<IListResponse<IDocuments>> {
    self.microservice = DocumentsEndpoints.Documents;
    return self
      .get<IListResponse<IDocuments>>(DocumentsEndpoints.Documents, params)
      .pipe(
        tap(resp => {
          this.microservice = '';
          console.log(params, resp);
        })
      );
  }

  getCities(params?: _Params): Observable<IListResponse<ICity>> {
    let partials = ENDPOINT_LINKS.City.split('/');
    this.microservice = partials[0];
    const route = partials[1];
    return this.get<IListResponse<ICity>>(route, params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(c => {
            return { ...c, nameAndId: `${c.idCity} - ${c.nameCity}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.nameCity < b.nameCity ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getCity(id: string | number): Observable<ICity> {
    const segments = ENDPOINT_LINKS.City.split('/');
    this.microservice = segments[0];
    const route = `${segments[1]}/id/${id}`;
    return this.get(route).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.idCity} - ${data.nameCity}`,
        };
      })
    );
  }

  getDynamicTables(id: number | string, params: ListParams) {
    return this.dynamicTablesService.getTvalTable1ByTableKey(id, params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(t => {
            return { ...t, otKeyAndValue: `${t.otKey} - ${t.value}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.value < b.value ? -1 : 1;
        });
        return data;
      })
    );
  }

  getByTableKeyOtKey(tableKey: number | string, OtKey: number | string) {
    return this.dynamicTablesService.getByTableKeyOtKey(tableKey, OtKey).pipe(
      map(data => {
        return {
          ...data,
          data: {
            ...data.data,
            otKeyAndValue: `${data.data.otKey} - ${data.data.value}`,
          },
        };
      })
    );
  }

  getTransferent(id: string | number) {
    return this.transferentService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.nameTransferent}`,
        };
      })
    );
  }

  getStation(id: string | number) {
    return this.stationService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.stationName}`,
        };
      })
    );
  }

  getAuthoritiesFilter(params?: string) {
    return this.authorityService.getAllFilter(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(a => {
            return { ...a, nameAndId: `${a.idAuthority} - ${a.authorityName}` };
          }),
        };
      })
    );
  }

  getMinPub(id: string | number) {
    return this.minPubService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
        };
      })
    );
  }

  getCourtsUnrelated(params?: _Params) {
    return this.courtService.getAllFiltered(params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(c => {
            return { ...c, nameAndId: `${c.id} - ${c.description}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.description < b.description ? -1 : 1;
        });
        return data;
      })
    );
  }

  getCourts(params?: string) {
    return this.courtsService.getAllWithFilters(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(c => {
            return {
              ...c.courtNumber,
              nameAndId: `${c.courtNumber.id} - ${c.courtNumber.description}`,
            };
          }),
        };
      })
    );
  }

  getCourt(id: string | number) {
    return this.courtService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
        };
      })
    );
  }

  getCourtsByCity(params: string) {
    return this.courtsService.getAllWithFilters(params);
  }

  getDefendants(params?: _Params): Observable<IListResponse<IIndiciados>> {
    return this.indiciadosService.getAllFiltered(params).pipe(
      map(data => {
        data = {
          ...data,
          data: data.data.map(c => {
            return { ...c, nameAndId: `${c.id} - ${c.name}` };
          }),
        };
        data.data.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });
        return data;
      }),
      tap(() => (this.microservice = ''))
    );
  }

  getDefendant(id: string | number) {
    return this.indiciadosService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.name}`,
        };
      })
    );
  }

  getPhaseEdo() {
    return this.goodParametersService.getPhaseEdo();
  }

  getIdentifier(id: string | number) {
    return this.identifierService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
        };
      })
    );
  }

  userAreaCheck(params: string) {
    return this.userCheckService.getAllWithFilters(params);
  }
}
