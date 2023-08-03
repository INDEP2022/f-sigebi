import { formatDate } from '@angular/common';
import { type FormControl, type FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  take,
  tap,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { showQuestion, showToast } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { type INotification } from 'src/app/core/models/ms-notification/notification.model';
import {
  IMJobManagement,
  IRSender,
} from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import {
  IAccesTrackingXArea,
  IUsersTracking,
} from 'src/app/core/models/ms-security/pup-user.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LegalOpinionsOfficeService } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/services/legal-opinions-office.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlyersService } from '../../services/flyers.service';

import { DialogSelectedManagementsComponent } from '../dialog-selected-managements/dialog-selected-managements.component';
import { DocumentsFormComponent } from '../documents-form/documents-form.component';
import { IGoodJobManagement } from '../related-documents.component';
import {
  IDocumentJobManagement,
  IGoodAndAvailable,
} from './related-documents-relation.component';

export abstract class RelateDocumentsResponseRelation extends BasePage {
  protected abstract goodServices: GoodService;
  protected abstract serviceOficces: GoodsJobManagementService;
  protected abstract notificationService: NotificationService;
  protected abstract mJobManagementService: MJobManagementService;
  protected abstract msProcedureManagementService: ProcedureManagementService;
  // protected abstract goodprocessService: GoodprocessService;
  protected abstract flyerService: FlyersService;
  protected abstract parametersService: ParametersService;
  protected abstract departmentService: DepartamentService;
  protected abstract svLegalOpinionsOfficeService: LegalOpinionsOfficeService;
  protected abstract authService: AuthService;
  // abstract origin: string;
  abstract formVariables: FormGroup<{
    b: FormControl;
    d: FormControl;
    dictamen: FormControl;
    classify: FormControl;
    classify2: FormControl;
    crime: FormControl;
  }>;
  protected abstract formJobManagement: FormGroup<{
    /** @description no_volante */
    flyerNumber: FormControl;
    /** @description tipo_oficio */
    jobType: FormControl;
    /** @description no_of_gestion */
    managementNumber: FormControl;
    /** @description  destinatario*/
    addressee: FormControl<IRSender>;
    /** @description remitente */
    sender: FormControl<IRSender>; // remitente
    /** @descripiton  cve_cargo_rem*/
    cveChargeRem: FormControl;
    /**@description DES_REMITENTE_PA */
    desSenderpa: FormControl;
    /** @description NO_DEL_REM */
    delRemNumber: FormControl;
    /** @description NO_DEP_REM */
    depRemNumber: FormControl;
    /** @description oficio_por */
    jobBy: FormControl;
    /** @description cve_of_gestion */
    cveManagement: FormControl;
    city: FormControl<{
      id: number | string;
      legendOffice: string;
      idName: string;
    }>; // ciudad,
    /** @description estatus_of */
    statusOf: FormControl;
    /**@description se_refiere_a */
    refersTo: FormControl;
    /** @Description texto1 */
    text1: FormControl;
    /** @Description texto2 */
    text2: FormControl;
    /** @Description texto3 */
    text3: FormControl;
    /** @description usuaro_insert */
    insertUser: FormControl;
    /**@description  fecha_inserto*/
    insertDate: FormControl;
    /**@description num_clave_armada */
    armedKeyNumber: FormControl;
    tipoTexto: FormControl;
    /**@descripcion no_expediente */
    proceedingsNumber: FormControl;
    /**@descripcion nom_pers_ext */
    nomPersExt: FormControl;
  }>;
  protected abstract formNotification: FormGroup;
  protected abstract route: ActivatedRoute;
  protected abstract siabService: SiabService;
  protected abstract sanitizer: DomSanitizer;
  protected abstract modalService: BsModalService;
  protected abstract securityService: SecurityService;
  protected abstract documentsService: DocumentsService;
  protected abstract usersService: UsersService;
  protected abstract goodprocessService: GoodprocessService;
  abstract dataTableGoods: IGoodAndAvailable[];
  abstract loadInfo(data: IMJobManagement): Promise<void>;
  abstract dataTableGoodsJobManagement: IGoodJobManagement[];
  abstract isDisabledBtnDocs: boolean;
  abstract se_refiere_a_Disabled: {
    A: boolean;
    B: boolean;
    C: boolean;
    D: boolean;
  };
  // abstract managementForm: FormGroup;
  isLoadingGood: boolean = false;
  abstract totalItems: number;

  isCreate = false;
  userInfo: {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string[];
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    acr: string;
    'allowed-origins': string[];
    realm_access: any;
    resource_access: any;
    scope: string;
    sid: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
    department: string;
    employeetype: string;
    puesto: string;
    username: string;
    cargonivel1: string;
    cargonivel2: string;
    cargonivel3: string;
    siglasnivel1: string;
    siglasnivel2: string;
    siglasnivel3: string;
    siglasnivel4: string;
    delegacionreg: string;
    delegationNumber: number;
    subdelegationNumber: number;
    departamentNumber: number;
    user: string;
    assigned: string;
    registryNumber?: number;
    delegation1Number: number;
    departament1Number: number;
    lastActive: number;
    delegation: any;
    subDelegation: any;
    departament: IDepartment;
    userDetail: any;
    userAndName?: string;
  };
  abstract dataTableGoodsMap: Map<number, IGoodAndAvailable>;

  /**NO_BIEN, DESCRIPCION, CANTIDAD, IDENTIFICADOR,NO_EXPEDIENTE, NO_CLASIF_BIEN, ESTATUS, NO_REGISTRO */
  convertDataGoods(data: { data: any[] }) {
    const _data = data.data.map((data: any) => {
      return {
        goodId: data.no_bien,
        description: data.descripcion,
        quantity: data.cantidad,
        identifier: data.identificador,
        status: data.estatus,
        proceedingsNumber: data.no_expediente,
        goodClassNumber: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        selected: this.dataGoodsSelected.has(data.no_bien),
      };
    });
    return _data;
  }

  convertDataGoodsAvailable(data: any) {
    const _data = data.data.map((data: any) => {
      return {
        goodNumber: data.no_bien,
        goods: data.descripcion,
        classify: data.no_clasif_bien,
        registerNumber: data.no_registro,
        available: data.disponible == 'N' ? true : false,
        managementNumber: this.formJobManagement.value.managementNumber,
      };
    });
    return _data;
  }
  getGoods1(params: ListParams) {
    this.isLoadingGood = true;
    params['proceedingsNumber'] = this.formNotification.value.expedientNumber;
    this.goodprocessService.getGoodAvailable(params).subscribe({
      next: async (data: { data: any[]; count: number }) => {
        this.dataTableGoods = this.convertDataGoods(data);
        console.log(`this.dataTableGoods`, this.dataTableGoods);
        this.dataTableGoodsMap = new Map<number, IGoodAndAvailable>(
          this.dataTableGoods.map(x => [x.goodId, x])
        );
        this.totalItems = data.count;
        this.isLoadingGood = false;
      },
      error: () => {
        this.isLoadingGood = false;
      },
    });
  }

  async getGoodsOnlyAvailable(params: ListParams = new ListParams()) {
    this.isLoadingGood = true;
    params.limit = this.totalItems;
    this.dataTableGoodsJobManagement = [];
    params['proceedingsNumber'] = this.formNotification.value.expedientNumber;
    try {
      const data = await firstValueFrom(
        this.goodprocessService.getGoodAvailable(params)
      );

      this.dataTableGoodsJobManagement = this.convertDataGoodsAvailable(
        data
      ).filter((x: { available: any }) => x.available);

      this.isLoadingGood = false;
    } catch (ex) {
      this.isLoadingGood = false;
      this.alert(
        'error',
        'Error',
        'Error al obtener los bienes disponibles',
        'error'
      );
    }
  }

  getFactaDbOficioGestrel(
    no_of_gestion: string | number,
    no_bien: string | number
  ): Promise<boolean> {
    return firstValueFrom(
      this.goodServices
        .getFactaDbOficioGestrel({
          no_bien,
          no_of_gestion,
        })
        .pipe(
          map(x => false),
          catchError(() => {
            return of(true);
          })
        )
    );
  }

  getNotification(
    wheelNumber: string | number,
    expendient: string | number
  ): Observable<INotification> {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;
    params['filter.wheelNumber'] = wheelNumber;
    if (expendient) {
      params['filter.expendient'] = expendient;
    }
    return this.notificationService.getAll(params).pipe(map(x => x.data[0]));
  }

  countManagements = 0;
  getMJobManagement(wheelNumber: string | number): Observable<IMJobManagement> {
    const params = new ListParams();
    params.page = 1;
    params['filter.flyerNumber'] = wheelNumber;
    return this.mJobManagementService.getAll(params).pipe(
      map(x => {
        this.countManagements = x.count;
        if (this.countManagements === 1) {
          this.loadInfo(x.data[0]);
        }
        if (this.countManagements > 1) {
          this.openDialogSelectedManagement(x);
        }
        return x.data[0];
      }),
      catchError((error, _a) => {
        if (error.status >= 400 && error.status < 500) {
          // return of(null);
          throw error;
        }
        console.log({ error });
        this.alert(
          'error',
          'Error',
          'Error al obtener la gestión por favor recarga la página'
        );
        throw error;
      })
    );
  }

  openDialogSelectedManagement(data?: IListResponse<IMJobManagement>) {
    let context: Partial<DialogSelectedManagementsComponent> = {
      queryParams: { flyerNumber: this.formJobManagement.value.flyerNumber },
      mJobManagements: data ? data.data : [],
      totalItems: data ? data.count : 0,
    };

    console.log({ context });

    const modalRef = this.modalService.show(
      DialogSelectedManagementsComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {
      console.log({ result });
      if (result) {
        this.loadInfo(result);
      }
    });
  }

  getJobManagement(params: ListParams): Observable<IProceduremanagement> {
    // const params = new ListParams();
    // params.page = 1;
    // params.limit = 1;
    // params['filter.flyerNumber'] = wheelNumber;
    return this.msProcedureManagementService
      .getAllFiltered(params)
      .pipe(map(x => x.data[0]));
  }

  getCity(text: string | number): Observable<ICity> {
    return this.flyerService.getCityById(text);
  }

  /**
   *
   * @param date Date
   * @returns
   */
  getFaStageCreda(date: Date): Promise<number> {
    const _date = formatDate(date, 'MM-dd-yyyy', 'en-US');
    return firstValueFrom(
      this.parametersService.getFaStageCreda(_date).pipe(
        map(response => {
          console.log(response);
          return response.stagecreated;
        })
      )
    );
  }

  getDepartment(
    params: ListParams,
    first: boolean = true
  ): Promise<IListResponse<IDepartment> | IDepartment> {
    return firstValueFrom(
      this.departmentService.getAll(params).pipe(
        map(res => {
          if (first) {
            console.log(res.data[0]);
            return res.data[0];
          } else {
            return res;
          }
        })
      )
    );
  }

  getGoodsJobManagementCount(list: ListParams): Promise<number> {
    return firstValueFrom(
      this.serviceOficces.getGoodsJobManagement(list).pipe(
        map(x => x.count),
        catchError(() => {
          return of(0);
        })
      )
    );
  }

  getDocJobManagement(
    params: ListParams | null = null
  ): Observable<IListResponse<IDocumentJobManagement>> {
    if (!params) {
      params = new ListParams();
      params['filter.managementNumber'] =
        this.formJobManagement.value.managementNumber;
    }
    params.limit = 10000000000000000000;
    return this.mJobManagementService.getDocOficioGestion(params).pipe(
      catchError((error, _a) => {
        if (error.status >= 400 && error.status < 500) {
          // return of(null);
          throw error;
        }
        console.log({ error });
        this.alert(
          'error',
          'Error',
          'Error al obtener los documentos de gestión por favor recarga la página'
        );
        throw error;
      })
    );
  }

  getDocJobManagementCount(params: ListParams) {
    params.limit = 1;
    params.page = 1;
    return firstValueFrom(
      this.mJobManagementService.getDocOficioGestion(params).pipe(
        map(x => x.count),
        catchError(ex => {
          return of(0);
        })
      )
    );
  }

  getGoodsJobManagement(
    params: ListParams
  ): Promise<IListResponse<IGoodJobManagement>> {
    return firstValueFrom(
      this.serviceOficces.getGoodsJobManagement(params).pipe(
        map(x => {
          return {
            ...x,
            data: x.data.map(item => {
              return {
                ...item,
                goods: item.goodNumber.description,
                classify: item.goodNumber.goodClassNumber,
                goodNumber: item.goodNumber.goodId,
                good: item.goodNumber,
              };
            }),
          } as any;
        }),
        catchError((error, _a) => {
          if (error.status >= 400 && error.status < 500) {
            // return of(null);
            throw error;
          }
          console.log({ error });
          this.alert(
            'error',
            'Error',
            'Error al obtener los bienes de la gestión por favor recarga la página'
          );
          throw error;
        })
      )
    );
  }

  // async getGoodsJobManagementMoreColumns(params: ListParams) {
  //   // const goodsJobManagement = (await (firstValueFrom(this.serviceOficces.getGoodsJobManagement(params)))).data;
  //   // const goods = await goodsJobManagement.map(async item => {
  //   //   if (item.goodNumber) {
  //   //     const good = await this.goodServices.getById(item.goodNumber);
  //   //     return {
  //   //       ...item,
  //   //       good,
  //   //     };
  //   //   }
  //   // });

  // }

  getSegAccessXAreas(params: _Params, first: boolean = true) {
    return firstValueFrom(
      this.securityService.getAllUsersAccessTracking(params).pipe(
        map(res => {
          if (first) {
            return res.data[0];
          } else {
            return res;
          }
        })
      )
    );
  }

  getSegUsers(params: _Params, first: boolean = true) {
    return firstValueFrom(
      this.securityService.getAllUsersTracker(params).pipe(
        map(res => {
          if (first) {
            return res.data[0];
          } else {
            return res;
          }
        })
      )
    );
  }

  postGoodsJobManagement(obj: {
    managementNumber: string;
    goodNumber: number | string;
    recordNumber: string;
  }) {
    return this.serviceOficces.postGoodsJobManagement(obj);
  }

  getDocumentForDictationSearch(params: _Params) {
    return this.documentsService.getDocumentForDictationSearch(params);
  }

  getDocumentForDictation(params: ListParams) {
    return this.documentsService.getDocumentForDictation(params);
  }

  postSegAccessXAreasTvalTabla1(body: {
    delegacionNo: string | number;
    user: string;
  }) {
    return firstValueFrom(
      this.usersService.postSegAccessXAreasTvalTabla1(body).pipe(
        map(res => {
          return res.data[0];
        }),
        catchError(() => {
          this.alert(
            'error',
            'Error',
            'El Usuario no está autorizado para eliminar el OficioS'
          );
          throw new Error('Error al obtener el siguiente valor');
        })
      )
    );
  }

  getNextVal(): Promise<number> {
    return firstValueFrom(
      this.goodprocessService.getNextValManagement().pipe(
        map(x => x.data[0].nextval),
        catchError(() => {
          this.alert(
            'error',
            'Error',
            'Error al obtener el siguiente valor de la gestión'
          );
          throw new Error('Error al obtener el siguiente valor');
        })
      )
    );
  }

  /*-------------------------- TOOLS----------------------------------*/

  getParamsForName(name: string): string | null {
    return this.route.snapshot.paramMap.get(name) || null;
  }

  pupShowReport() {
    let params = {};

    let nameReport = 'RGEROFGESTION';
    const jobType = this.formJobManagement.value.jobType;
    const PLLAMO = this.getParamsForName('PLLAMO');
    if (jobType == 'INTERNO' && PLLAMO != 'ABANDONO') {
      params = {
        PARAMFORM: 'NO',
        // P_FIRMA: 'S',
        NO_OF_GES: this.formJobManagement.value.managementNumber,
        TIPO_OF: this.formJobManagement.value.jobType,
        VOLANTE: this.formNotification.value.wheelNumber,
        EXP: this.formNotification.value.expedientNumber,
      };
      nameReport = 'RGEROFGESTION';
    } else if (jobType == 'EXTERNO' && PLLAMO != 'ABANDONO') {
      params = {
        no_of_ges: this.formJobManagement.value.managementNumber,
      };
      nameReport = 'RGEROFGESTION_EXT';
    } else if (jobType == 'EXTERNO' && PLLAMO == 'ABANDONO') {
      params = {
        PVOLANTE: this.formNotification.value.wheelNumber,
        PNOOFGESTION: this.formJobManagement.value.managementNumber,
        PEXPEDIENTE: this.formNotification.value.expedientNumber,
      };
      nameReport = 'RGENABANSUB';
    } else {
      this.alert(
        'error',
        'Error',
        'No se ha especificado el tipo de oficio (EXTERNO,INTERNO)'
      );
    }

    this.siabService.fetchReport(nameReport, params).subscribe(response => {
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
      }
    });
  }

  enableOrDisabledRadioRefersTo(letter: 'A' | 'B' | 'C', isEnable = true) {
    if (!isEnable) {
      document
        .getElementById(`se_refiere_a_${letter}`)
        .setAttribute('disabled', 'disabled');
    } else {
      document
        .getElementById(`se_refiere_a_${letter}`)
        .removeAttribute('disabled');
    }
  }

  async getUserInfo() {
    if (this.userInfo) {
      return this.userInfo;
    }
    const auth = this.authService.decodeToken();
    const data = await this.getUserDataLogged(
      auth.preferred_username?.toLocaleUpperCase() || auth.preferred_username
    );
    console.log({ data, auth });
    this.userInfo = { ...data, ...auth };
    return this.userInfo;
  }

  async getUserDataLogged(userId: string) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'user',
      userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
    );
    let subscription = await firstValueFrom(
      this.svLegalOpinionsOfficeService.getInfoUserLogued(params.getParams())
    );
    return subscription.data?.[0];
  }

  async pupGeneratorKey(): Promise<string> {
    let key = '';
    const values = this.formJobManagement.value;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    if (this.getParamsForName('PLLAMO') == 'ABANDONO') {
      key = await Promise.resolve(`SAE/${month}/?/${year}`);
      return key;
    } else {
      let segAccessXAreas;
      let segUser;
      let faEtapaCreada;
      try {
        faEtapaCreada = await this.getFaStageCreda(new Date());
      } catch (ex) {
        console.log(ex);
        this.alert(
          'error',
          'Error',
          'Error no se pudo obtener la función FA_ETAPACREDA.'
        );
        throw new Error('Error no se pudo obtener la función FA_ETAPACREDA.');
      }

      try {
        const params = {
          'filter.user': values.sender.usuario,
          'filter.assigned': 'S',
        };
        segAccessXAreas = (await this.getSegAccessXAreas(
          params
        )) as IAccesTrackingXArea;

        segUser = (await this.getSegUsers({
          'filter.user': values.sender.usuario,
        })) as IUsersTracking;
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se localizaron datos de la persona que autoriza.'
        );
        throw ex;
      }

      let level4, level5, level3, level2, department;
      try {
        const params = new ListParams();
        params['filter.id'] = segAccessXAreas.departmentNumber;
        params['filter.numDelegation'] = segAccessXAreas.delegationNumber;
        params['filter.numSubDelegation'] = segAccessXAreas.subdelegationNumber;
        params['filter.phaseEdo'] = faEtapaCreada;
        department = (await this.getDepartment(params)) as IDepartment;
        if (department.level || department.depend || department.depDelegation) {
          if (department.level == 4) {
            level4 = department.dsarea;
            level5 = segUser.postKey;
          } else {
            level4 = segUser.postKey;
            level3 = department.dsarea;
          }

          for (let VI = department.level - 1; VI >= 2; VI--) {
            let _department;
            try {
              const params = new ListParams();
              params['filter.id'] = department.depend;
              params['filter.numDelegation'] = department.depDelegation;
              params['filter.phaseEdo'] = faEtapaCreada;
              _department = (await this.getDepartment(params)) as IDepartment;
            } catch (ex) {
              this.alert(
                'error',
                'Error',
                'No se localizó el predecesor de la persona que autoriza.'
              );
              throw ex;
            }
            if (_department.level == 3) {
              level3 = _department.dsarea;
            } else if (_department.level == 2) {
              level2 = _department.dsarea;
            }
            department.depend = _department.depend;
            department.depDelegation = _department.depDelegation;
          }
        } else {
          throw new Error(
            'No se localizó la dependencia de la persona que autoriza.'
          );
        }
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se localizó la dependencia de la persona que autoriza.'
        );
        throw ex;
      }
      const year = new Date().getFullYear().toString();

      let joyKey = `${level2}/${level3}/${level4}`;
      if (
        department.level &&
        !isNaN(department.level as any) &&
        Number(department.level) + 1 == 5
      ) {
        if (!level5) {
          this.alert(
            'error',
            'Error',
            'No se localizó el puesto de la persona que autoriza.'
          );
          throw new Error(
            'No se localizó el puesto de la persona que autoriza.'
          );
        }
        joyKey += `/${level5}`;
      }
      joyKey += `/?/${year}`.trim();
      if (!level2 || !level3 || !level4) {
        this.alert(
          'error',
          'Error',
          'No se localizó la dependencia de la persona que autoriza.'
        );
        throw new Error(
          'No se localizó la dependencia de la persona que autoriza.'
        );
      }
      return joyKey;
    }
  }

  abstract dataGoodsSelected: Map<number, IGoodAndAvailable>;
  async pupAddGood() {
    console.log('pupAddGood');
    // const newRows: IGoodJobManagement[] = [];
    // if (this.totalItems < 1000) {
    await this.getGoodsOnlyAvailable();
    // }
    // if(this.totalItems == ) {}
    // convert map to array
    // Array.from(this.dataGoodsSelected.values()).forEach(item => {
    //   const existRow = this.dataTableGoodsJobManagement.find(
    //     x => x.goodNumber == item.goodId
    //   );
    //   if (existRow) return;
    //   newRows.push({
    //     goodNumber: item.goodId,
    //     recordNumber: '',
    //     classify: item.goodClassNumber as any,
    //     managementNumber: this.formJobManagement.value.managementNumber,
    //     good: item,
    //     goods: item.description,
    //   });
    // });
    // this.dataTableGoodsJobManagement = [
    //   ...this.dataTableGoodsJobManagement,
    //   ...newRows,
    // ];

    // ------------ antiguo codigo
    // const goodAvailables = this.dataTableGoods.filter(item => item.available);
    // const newRows: IGoodJobManagement[] = [];

    // goodAvailables.forEach(item => {
    //   const existRow = this.dataTableGoodsJobManagement.find(
    //     x => x.goodNumber == item.goodId
    //   );
    //   if (existRow) return;
    //   newRows.push({
    //     goodNumber: item.goodId,
    //     recordNumber: '',
    //     classify: item.goodClassNumber as any,
    //     managementNumber: this.formJobManagement.value.managementNumber,
    //     good: item,
    //     goods: item.description,
    //   });
    //   item.available = false;
    //   if (!this.isCreate) {
    //     this.postGoodsJobManagement({
    //       goodNumber: item.goodId,
    //       recordNumber: '',
    //       managementNumber: this.formJobManagement.value.managementNumber,
    //     }).subscribe();
    //   }
    // });
    // this.dataTableGoodsJobManagement = [
    //   ...this.dataTableGoodsJobManagement,
    //   ...newRows,
    // ];
  }

  pupAddAnyGood() {
    const newRows: IGoodJobManagement[] = [];
    this.dataTableGoodsJobManagement = [];
    // this.dataTableDocuments = [];
    // convert map to array
    Array.from(this.dataGoodsSelected.values()).forEach(item => {
      const existRow = this.dataTableGoodsJobManagement.find(
        x => x.goodNumber == item.goodId
      );
      if (existRow) return;
      newRows.push({
        goodNumber: item.goodId,
        recordNumber: '',
        classify: item.goodClassNumber as any,
        managementNumber: this.formJobManagement.value.managementNumber,
        good: item,
        goods: item.description,
      });
      this.dataTableGoodsMap.get(item.goodId).available = false;
    });
    this.dataTableGoodsJobManagement = [
      ...this.dataTableGoodsJobManagement,
      ...newRows,
    ];
    // const goodAvailables = this.dataTableGoods.filter(
    //   item => item.available && (item as any)?.['seleccion']
    // );
    // const newRows: IGoodJobManagement[] = [];
    // goodAvailables.forEach(item => {
    //   const existRow = this.dataTableGoodsJobManagement.find(
    //     x => x.goodNumber == item.goodId
    //   );
    //   if (existRow) return;
    //   newRows.push({
    //     goodNumber: item.goodId,
    //     recordNumber: '',
    //     classify: item.goodClassNumber as any,
    //     managementNumber: this.formJobManagement.value.managementNumber,
    //     good: item,
    //     goods: item.description,
    //   });
    //   if (!this.isCreate) {
    //     this.postGoodsJobManagement({
    //       goodNumber: item.goodId,
    //       recordNumber: '',
    //       managementNumber: this.formJobManagement.value.managementNumber,
    //     }).subscribe();
    //     item.available = false;
    //   }
    // });
    // this.dataTableGoodsJobManagement = [
    //   ...this.dataTableGoodsJobManagement,
    //   ...newRows,
    // ];
  }

  deleteGoodJobManagement(_good: number) {
    this.dataTableDocuments = [];
    const index = this.dataTableGoodsJobManagement.findIndex(
      x => x.goodNumber == _good
    );
    if (index < 0) return;
    const good = this.dataTableGoodsJobManagement[index].good;
    this.dataTableGoodsJobManagement.splice(index, 1);
    this.dataTableGoodsMap.get(_good).available = true;
    this.dataTableGoodsMap.get(_good).selected = false;
    this.dataGoodsSelected.delete(_good);
  }

  dataSelectDictation = new DefaultSelect([
    { key: 'PROCEDENCIA' },
    { key: 'DECOMISO' },
    { key: 'DEVOLUCION' },
    { key: 'TRANSFERENTE' },
  ]);
  searchDocumentForDictation(params: ListParams) {
    /*  select distinct tipo_dictaminacion
      from documentos_para_dictamen
      WHERE tipo_dictaminacion IN ('PROCEDENCIA','DECOMISO','DEVOLUCION','TRANSFERENTE')
      order by tipo_dictaminacion 
  */
    // const params = new ListParams();

    if (params['search'])
      params['filter.description'] = params['search']
        ? `$like:${params['filter.search']}`
        : '';
    params['filter.typeDictum'] =
      '$in:PROCEDENCIA,DECOMISO,DEVOLUCION,TRANSFERENTE';
    params['order'] = 'typeDictum';
    this.documentsService.getDocumentForDictation(params).subscribe({
      next: res => {
        const data = res.data.map(item => {
          return {
            ...item,
            keyDescription: `${item.key} - ${item.description} - ${item.typeDictum}`,
          };
        });
        this.dataSelectDictation = new DefaultSelect(data);
      },

      error: err => {
        this.dataSelectDictation = new DefaultSelect([]);
      },
    });
  }

  abstract initForm(): void;

  isLoadingBtnEraser = false;
  abstract copyOficio: any[];
  async onClickBtnDelete() {
    console.log('onClickBtnErase');
    const values = this.formJobManagement.value;
    if (!values.managementNumber) {
      this.alert('error', 'Error', 'No se tiene oficio.');
      return;
    }
    if (values.statusOf == 'ENVIADO') {
      this.alert(
        'error',
        'Error',
        'El oficio ya esta enviado no puede borrar.'
      );
      return;
    }
    const auth = this.authService.decodeToken();
    if (
      values.insertUser?.toLowerCase() !==
      auth.preferred_username?.toLowerCase()
    ) {
      const userInfo = await this.getUserInfo();
      await this.postSegAccessXAreasTvalTabla1({
        delegacionNo: userInfo.delegationNumber,
        user: userInfo.preferred_username,
      });
    }
    if (values.cveManagement.indexOf('?') === -1) {
      this.alert(
        'error',
        'Error',
        'La clave está armada, no puede borrar oficio.'
      );
      return;
    }
    const question = await showQuestion({
      icon: 'question',
      title: 'Confirmación',
      text: `Se borra oficio (Exp.: ${this.formNotification.value.expedientNumber}) No. Oficio: ${values.managementNumber}?`,
    });
    if (!question.isConfirmed) {
      return;
    }
    await firstValueFrom(
      this.mJobManagementService.deleteJobManagement(
        values.managementNumber,
        this.formNotification.value.wheelNumber
      )
    );
    this.formJobManagement.reset();
    this.formVariables.reset();
    this.dataTableDocuments = [];
    this.dataTableGoodsJobManagement = [];
    this.dataTableGoodsJobManagement;
    this.copyOficio = [];
    this.initForm();
    this.formJobManagement.get('refersTo').setValue('D');
    this.se_refiere_a_Disabled.A = false;
    this.se_refiere_a_Disabled.B = false;
    this.isDisabledBtnDocs = false;
    this.settingsTableDocuments.actions = {
      edit: false,
      add: false,
      delete: true,
    };
    this.tableDocs.initGrid();

    this.initForm();
  }

  async pupSearchNumber(delegationNumber: any) {
    const result = await firstValueFrom(
      this.mJobManagementService.postPupSearchNumber({
        pCveOfManagement: this.formJobManagement.value.cveManagement,
        pDelegationNumber: delegationNumber,
        pManagementOfNumber: this.formJobManagement.value.managementNumber,
      })
    );

    this.formJobManagement
      .get('armedKeyNumber')
      .setValue(result.NUM_CLAVE_ARMADA);
    this.formJobManagement.get('cveManagement').setValue(result.CVE_OF_GESTION);
    this.formJobManagement.get('insertDate').setValue(result.FECHA_INSERTO);
  }

  async onClickBtnSend() {
    console.log('onClickBtnSend');
    const values = this.formJobManagement.value;
    if (values.statusOf == 'ENVIADO') {
      //TODO: pup_act_gestion

      this.pupShowReport();
      return;
    }

    if (
      values.cveManagement.includes('?') &&
      values.statusOf == 'EN REVISION'
    ) {
      const counter = await firstValueFrom(
        this.mJobManagementService.getActNom(values.managementNumber).pipe(
          map(x => {
            console.log(x);
            return x.actnom;
          }),
          catchError(err => of(0))
        )
      );
      if (counter == 1) {
        showToast({
          icon: 'error',
          title: 'Error',
          text: 'SE ACTUALIZARÁ LA NOMENCLATURA CONFORME AL NUEVO ESTATUTO YA QUE FUE ELABORADO ANTES DE LA PUBLICACION DE ESTÉ.',
        });
        const key = await this.pupGeneratorKey();
        this.formJobManagement.get('cveManagement').setValue(key);
      }
      const userInfo = await this.getUserInfo();
      await this.pupSearchNumber(userInfo.delegationNumber);
      this.formJobManagement.get('statusOf').setValue('ENVIADO');
      //TODO: pup_act_gestion
      //TODO: Guardar m_job_gestion
      await this.commit();
      this.pupShowReport();
      this.formJobManagement.disable();
    }
  }

  getValuesNotNull() {
    const values = this.formJobManagement.value;
    const keys = Object.keys(values);
    const result: any = {};
    keys.forEach(key => {
      if ((values as any)[key]) {
        result[key] = (values as any)[key];
      }
    });
    delete result.tipoTexto;
    if (values.addressee) {
      if (values.jobType == 'INTERNO') {
        result.addressee = values.addressee?.usuario;
      } else {
        delete result.addressee;
        // result.addressee = '';
      }
    }
    if (values.nomPersExt) {
      if (values.jobType == 'EXTERNO') {
        result.nomPersExt = values.nomPersExt;
      } else {
        delete result.nomPersExt;
        // result.nomPersExt = '';
      }
    }
    if (values.sender) {
      result.sender = values.sender.usuario;
    }
    if (values.city) {
      result.city = values.city.id;
    }
    result.insertDate = '06-13-2023';
    return result;
  }
  abstract se_refiere_a: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  abstract settingsTableDocuments: any;
  abstract tableDocs: any;
  async commit() {
    if (this.isCreate) {
      this.formJobManagement.get('jobBy').setValue('RELACIONADO');
      const values = this.getValuesNotNull();
      values.jobBy =
        this.getParamsForName('PLLAMO') == 'ABANDONO'
          ? 'ABANDONO'
          : 'RELACIONADO';

      await firstValueFrom(
        this.mJobManagementService.create(values).pipe(
          tap((e: any) => {
            this.isCreate = false;
            console.log({ values: e });
            e['addressee'] = this.formJobManagement.value.addressee;
            this.formJobManagement.patchValue(e);
            // if (this.formJobManagement.value.refersTo == this.se_refiere_a.A) {
            //   this.goodprocessService.postTransferGoodsTradeManagement({
            //     ofManagementNumber: this.formJobManagement.value.managementNumber,
            //     proceedingsNumber: this.formNotification.value.wheelNumber,
            //     goodNumber: item.goodNumber,
            //   })
            // } else {
            // this.dataTableGoodsJobManagement
            this.dataTableGoodsJobManagement.forEach(item => {
              this.postGoodsJobManagement({
                goodNumber: item.goodNumber,
                recordNumber: '',
                managementNumber: this.formJobManagement.value.managementNumber,
              }).subscribe();
            });
            // }
            this.dataTableDocuments.forEach(item => {
              this.mJobManagementService
                .createDocumentOficeManag({
                  managementNumber:
                    this.formJobManagement.value.managementNumber,
                  cveDocument: item.cveDocument,
                  rulingType: item.rulingType,
                  goodNumber: item.goodNumber,
                  recordNumber: '',
                })
                .subscribe();
            });
            if (this.dataTableDocuments.length > 0) {
              this.settingsTableDocuments.actions = {
                edit: false,
                add: false,
                delete: false,
              };
              this.tableDocs.initGrid();
            }
          }),
          catchError(() => {
            showToast({
              icon: 'error',
              title: 'Error',
              text: 'Error al guardar los datos',
            });
            throw new Error('Error al guardar los datos');
          })
        )
      );
    } else {
      const values = this.getValuesNotNull();
      if (values.cveManagement) {
        await firstValueFrom(
          this.mJobManagementService.update(values).pipe(
            catchError(() => {
              showToast({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar los datos',
              });
              return of(null);
            })
          )
        );
        try {
          const params = new ListParams();
          params['filter.managementNumber'] =
            this.formJobManagement.value.managementNumber;
          const counter = await this.getGoodsJobManagementCount(params);
          if (counter == 0) {
            this.dataTableGoodsJobManagement.forEach(item => {
              this.postGoodsJobManagement({
                goodNumber: item.goodNumber,
                recordNumber: '',
                managementNumber: this.formJobManagement.value.managementNumber,
              }).subscribe();
            });
          }
          const params1 = new ListParams();
          params1['filter.managementNumber'] =
            this.formJobManagement.value.managementNumber;
          const counter1 = await this.getDocJobManagementCount(params1);
          if (counter1 == 0) {
            this.dataTableDocuments.forEach(item => {
              this.mJobManagementService
                .createDocumentOficeManag({
                  managementNumber:
                    this.formJobManagement.value.managementNumber,
                  cveDocument: item.cveDocument,
                  rulingType: item.rulingType,
                  goodNumber: item.goodNumber,
                  recordNumber: '',
                })
                .subscribe();
            });
          }
          if (this.dataTableDocuments.length > 0) {
            this.settingsTableDocuments.actions = {
              edit: false,
              add: false,
              delete: false,
            };
            this.tableDocs.initGrid();
          }
        } catch (ex) {}
        // this.dataTableDocuments.forEach(item => {
        //   this.mJobManagementService
        //     .createDocumentOficeManag({
        //       managementNumber: this.formJobManagement.value.managementNumber,
        //       cveDocument: item.cveDocument,
        //       rulingType: item.rulingType,
        //       goodNumber: item.goodNumber,
        //       recordNumber: '',
        //     })
        //     .subscribe();
        // });
      }
    }
  }

  selectedChecksC() {
    this.formVariables.get('b').setValue('N');
  }

  getGlobals(key: string): number {
    return 2;
  }

  pupActManagement() {
    let var1, var2;
    if (
      this.getParamsForName('P_GEST_OK') == '1' ||
      this.getGlobals('gnu_activa_gestion') == 1
    ) {
      if (this.getParamsForName('PLLAMO') == 'ABANDONO') {
        var1 = 'DJS';
        var2 = 'DJ';
      } else {
        var1 = 'FNI';
        var2 = 'AB';
      }
    }
  }

  async onClickBtnDocuments() {
    const valuesVariables = this.formVariables.value;
    const valuesJobManagement = this.formJobManagement.value;
    console.log(valuesVariables);
    if (!valuesVariables.dictamen) {
      this.alert('error', 'Error', 'Especifique el tipo de Dictaminación.');
      return;
    }

    if (valuesVariables.b == 'S') {
      if (!valuesJobManagement.cveManagement) {
        const sequencialOfManagement = await this.getNextVal();
        this.formJobManagement
          .get('managementNumber')
          .setValue(sequencialOfManagement);
        if (valuesJobManagement.refersTo == 'Se refiere a todos los bienes') {
          //TODO: await this.commit();
          await this.pupAddGood();
        }
        if (
          valuesJobManagement.refersTo ==
          'Se refiere a algun(os) bien(es) del expediente'
        ) {
          this.pupAddAnyGood();
          //TODO: await this.commit();
        }
        this.formVariables.get('classify').setValue(null);
        if (this.dataTableGoodsJobManagement?.[0]?.classify) {
          const auxArr: string[] = [];
          this.dataTableGoodsJobManagement.forEach(x => {
            if (x.classify) {
              auxArr.push(x.classify as string);
            }
          });

          this.formVariables.get('classify').setValue(auxArr.join(','));
          this.formVariables.get('classify2').setValue(auxArr.join(','));
        }
      }

      if (valuesJobManagement.cveManagement) {
        const params = new ListParams();
        params.limit = 1;
        params.page = 1;
        params['filter.managementNumber'] =
          valuesJobManagement.managementNumber;
        const counter = await this.getGoodsJobManagementCount(params);

        if (
          valuesJobManagement.refersTo == 'Se refiere a todos los bienes' &&
          counter == 0
        ) {
          await this.pupAddGood();
        }
        if (
          valuesJobManagement.refersTo ==
            'Se refiere a algun (os) bien (es) del expediente' &&
          counter == 0
        ) {
          this.dataTableDocuments = [];
          this.pupAddAnyGood();
        }

        this.formVariables.get('classify').setValue(null);
        if (this.dataTableGoodsJobManagement?.[0]?.classify) {
          const auxArr: string[] = [];
          this.dataTableGoodsJobManagement.forEach(x => {
            if (x.classify) {
              auxArr.push(x.classify as string);
            }
          });
          this.formVariables.get('classify').setValue(auxArr.join(','));
          this.formVariables.get('classify2').setValue(auxArr.join(','));
        }
      }

      if (
        valuesJobManagement.cveManagement &&
        valuesJobManagement.refersTo == 'Se refiere a todos los bienes'
      ) {
        this.se_refiere_a_Disabled.B = true;
        this.se_refiere_a_Disabled.C = true;
      }

      if (
        valuesJobManagement.cveManagement &&
        valuesJobManagement.refersTo ==
          'Se refiere a algun (os) bien (es) del expediente'
      ) {
        this.se_refiere_a_Disabled.A = true;
        this.se_refiere_a_Disabled.C = true;
      }

      this.openRDictaminaDoc();
    }
  }

  openRDictaminaDoc() {
    // const modalRef = this.modalService.show(DocumentsFormComponent, {
    //   initialState: context,
    //   class: 'modal-lg modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // });
    let context: Partial<DocumentsFormComponent> = { queryParams: {} };
    if (this.formVariables.get('dictamen').value == 'PROCEDENCIA') {
      context.queryParams = {
        crime: this.formVariables.get('crime').value,
        typeDictation: this.formVariables.get('dictamen').value,
        typeSteeringwheel: this.formNotification.get('wheelType').value,
        numberClassifyGood: `$in:${this.formVariables.get('classify2').value}`,
      };
    } else if (this.formVariables.get('dictamen').value != 'PROCEDENCIA') {
      context.queryParams = {
        typeDictation: this.formVariables.get('dictamen').value,
        typeSteeringwheel: this.formNotification.get('wheelType').value,
        numberClassifyGood: `$in:${this.formVariables.get('classify2').value}`,
      };
    }
    console.log({ context });

    const modalRef = this.modalService.show(DocumentsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {
      console.log({ onclose: result });
      if (result && result?.length > 0) {
        result.forEach(item => {
          const doc = this.dataTableDocuments.find(
            x => x.cveDocument == item.cveDocument
          );
          if (!doc) {
            this.dataTableDocuments = [
              ...this.dataTableDocuments,
              {
                cveDocument: item.cveDocument,
                description: item.descripcion,
                goodNumber: '',
                managementNumber: this.formJobManagement.value.managementNumber,
                recordNumber: '',
                rulingType: this.formVariables.value.dictamen,
              },
            ];
          }
        });
      }
    });
  }

  abstract dataTableDocuments: IDocumentJobManagement[];
}
