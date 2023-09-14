import { formatDate } from '@angular/common';
import { type FormControl, type FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, Observable, of, take } from 'rxjs';
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
import {
  IPufGenerateKey,
  IStatusChange,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { type INotification } from 'src/app/core/models/ms-notification/notification.model';
import {
  IMJobManagement,
  IMJobManagementExtSSF3,
} from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import {
  IAccesTrackingXArea,
  IUsersTracking,
} from 'src/app/core/models/ms-security/pup-user.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LegalOpinionsOfficeService } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/services/legal-opinions-office.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlyersService } from '../services/flyers.service';
import { DialogSelectedManagementsComponent } from './dialog-selected-managements/dialog-selected-managements.component';
import {
  IGoodAndAvailable,
  IGoodJobManagement,
} from './related-documents.component';

export abstract class RelateDocumentsResponse extends BasePage {
  protected abstract goodServices: GoodService;
  protected abstract serviceOficces: GoodsJobManagementService;
  protected abstract notificationService: NotificationService;
  protected abstract mJobManagementService: MJobManagementService;
  protected abstract msProcedureManagementService: ProcedureManagementService;
  protected abstract flyerService: FlyersService;
  protected abstract parametersService: ParametersService;
  protected abstract departmentService: DepartamentService;
  protected abstract svLegalOpinionsOfficeService: LegalOpinionsOfficeService;
  protected abstract authService: AuthService;
  protected abstract goodHistoryService: HistoryGoodService; // protected abstract svLegalOpinionsOfficeService: LegalOpinionsOfficeService;
  abstract loadInfo(data: IMJobManagement): Promise<void>;

  abstract formVariables: FormGroup<{
    dictaminacion: FormControl;
    b: FormControl;
    d: FormControl;
    dictamen: FormControl;
    classify: FormControl;
    classify2: FormControl;
    crime: FormControl;
    proc_doc_dic: FormControl;
    doc_bien: FormControl;
    todos: FormControl;
  }>;
  protected abstract formJobManagement: FormGroup<{
    /** @description no_volante */
    flyerNumber: FormControl;
    /** @description tipo_oficio */
    jobType: FormControl;
    /** @description no_of_gestion */
    managementNumber: FormControl;
    /** @description  destinatario*/
    addressee: FormControl<{
      user: number | string;
      name: string;
      userAndName: string;
    }>;
    /** @description remitente */
    sender: FormControl<{
      id: number | string;
      name: string;
      idName: string;
    }>; // remitente
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
    /** @description  no_expediente*/
    proceedingsNumber: FormControl;
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
  protected abstract dictationService: DictationService;
  protected abstract msOfficeManagementService: OfficeManagementService;
  abstract dataTableGoods: IGoodAndAvailable[];
  abstract dataTableGoodsJobManagement: IGoodJobManagement[];
  abstract isDisabledBtnDocs: boolean;
  abstract selectedAllImpro: boolean;
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
  getGoods1(params: ListParams) {
    this.isLoadingGood = true;
    this.goodServices.getAll(params).subscribe({
      next: async data => {
        const goods = await data.data.map(async (item: any) => {
          item['improcedente'] = this.selectedAllImpro == true ? true : false;
          const isAvailable = await this.getFactaDbOficioGestrel(
            this.formJobManagement.get('managementNumber').value,
            item.goodId
          );
          return {
            ...item,
            available: isAvailable,
          };
        });
        this.dataTableGoods = await Promise.all(goods);
        this.totalItems = data.count;
        this.isLoadingGood = false;
        console.log('GOODS ', this.dataTableGoods);
      },
      error: () => {
        this.isLoadingGood = false;
      },
    });
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
    //params.page = 1;
    //params.limit = 1;
    params['filter.flyerNumber'] = wheelNumber;
    params['filter.jobBy'] = 'POR DICTAMEN';
    //return this.mJobManagementService.getAll(params).pipe(map(x => x.data[0]));
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
  updateMJobManagement(params: Partial<IMJobManagement>): Observable<any> {
    return this.mJobManagementService.update(params).pipe(map(x => x.data));
  }
  createMJobManagement(params: Partial<IMJobManagement>): Observable<any> {
    return this.mJobManagementService.create(params).pipe(map(x => x.data));
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
    const _date = formatDate(date, 'dd-MM-yyyy', 'en-US');
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

  getDocJobManagement(params: ListParams | null = null) {
    if (!params) {
      params = new ListParams();
      params['filter.managementNumber'] =
        this.formJobManagement.value.managementNumber;
    }
    return this.mJobManagementService.getDocOficioGestion(params);
  }

  getDocJobManagementCount(params: ListParams) {
    params.limit = 1;

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
        catchError(() => {
          return of({ data: [], count: 0 });
        }),
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
    const params = {
      // PARAMFORM: 'NO',
      // P_FIRMA: 'S',
      PARAMFORM: 'NO',
      NO_OF_GES: this.formJobManagement.value.managementNumber,
      TIPO_OF: this.formJobManagement.value.jobType,
      VOLANTE: this.formNotification.value.wheelNumber,
      EXP: this.formNotification.value.expedientNumber,
    };

    let nameReport = 'RGEROFGESTION';
    const jobType = this.formJobManagement.value.jobType;
    const PLLAMO = this.getParamsForName('PLLAMO');
    if (jobType == 'INTERNO' && PLLAMO != 'ABANDONO') {
      nameReport = 'RGEROFGESTION';
    } else if (jobType == 'EXTERNO' && PLLAMO != 'ABANDONO') {
      nameReport = 'RGEROFGESTION_EXT';
    } else if (jobType == 'EXTERNO' && PLLAMO == 'ABANDONO') {
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
    // document.getElementById(`se_refiere_a_${letter}`).removeAttribute('disabled');
  }

  async getUserInfo() {
    const auth = this.authService.decodeToken();
    const data = await this.getUserDataLogged(
      auth.preferred_username?.toLocaleUpperCase() || auth.preferred_username
    );
    console.log({ data, auth });
    return { ...data, ...auth };
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
          'filter.user': values.sender.id,
          'filter.assigned': 'S',
        };
        segAccessXAreas = (await this.getSegAccessXAreas(
          params
        )) as IAccesTrackingXArea;

        segUser = (await this.getSegUsers({
          'filter.user': values.sender.id,
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
          this.alert(
            'error',
            'Error',
            'No se localizó la dependencia de la persona que autoriza.'
          );
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
        joyKey += `/${level5}`;
      }
      joyKey += `/?/${year}`.trim();
      return joyKey;
    }
  }

  pupAddGood() {
    console.log('pupAddGood');
    const goodAvailables = this.dataTableGoods.filter(item => item.available);
    const newRows: IGoodJobManagement[] = [];

    goodAvailables.forEach(item => {
      newRows.push({
        goodNumber: item.goodId,
        recordNumber: '',
        classify: item.goodClassNumber as any,
        managementNumber: this.formJobManagement.value.managementNumber,
        good: item,
        goods: item.description,
      });
      this.postGoodsJobManagement({
        goodNumber: item.goodId,
        recordNumber: '',
        managementNumber: this.formJobManagement.value.managementNumber,
      }).subscribe();
      item.available = false;
    });
    this.dataTableGoodsJobManagement = [
      ...this.dataTableGoodsJobManagement,
      ...newRows,
    ];
    this.formVariables.get('b').setValue('S');
  }

  pupAddAnyGood() {
    console.log('pupAddAnyGood');
    const goodAvailables = this.dataTableGoods.filter(
      item => item.available && (item as any)?.['seleccion']
    );
    const newRows: IGoodJobManagement[] = [];
    goodAvailables.forEach(item => {
      newRows.push({
        goodNumber: item.goodId,
        recordNumber: '',
        classify: item.goodClassNumber as any,
        managementNumber: this.formJobManagement.value.managementNumber,
        good: item,
        goods: item.description,
      });
      this.postGoodsJobManagement({
        goodNumber: item.goodId,
        recordNumber: '',
        managementNumber: this.formJobManagement.value.managementNumber,
      }).subscribe();
      item.available = false;
    });
    this.dataTableGoodsJobManagement = [
      ...this.dataTableGoodsJobManagement,
      ...newRows,
    ];
    this.formVariables.get('b').setValue('S');
  }

  dataSelectDictation = new DefaultSelect([]);
  searchDocumentForDictation(params: ListParams) {
    /*  select distinct tipo_dictaminacion
      from documentos_para_dictamen
      WHERE tipo_dictaminacion IN ('PROCEDENCIA','DECOMISO','DEVOLUCION','TRANSFERENTE')
      order by tipo_dictaminacion 
  */
    // const params = new ListParams();
    params['filter.typeDictum'] =
      '$in:PROCEDENCIA,DECOMISO,DEVOLUCION,TRANSFERENTE';
    params['order'] = 'typeDictum';
    this.getDocumentForDictationSearch(params).subscribe({
      next: res => {
        const data = res.data.map(item => {
          return {
            ...item,
            keyDescription: `${item.key} - ${item.description}`,
          };
        });
        this.dataSelectDictation = new DefaultSelect(data);
      },
    });
  }

  abstract initForm(): void;

  isLoadingBtnEraser = false;
  async onClickBtnErase() {
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
    if (!(values.managementNumber as string).includes('?')) {
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

    const promises = [
      this.mJobManagementService.deleteGoodsJobManagement1(
        values.managementNumber
      ),
      this.mJobManagementService.deleteDocumentJobManagement2(
        values.managementNumber
      ),
      this.mJobManagementService.deleteMJobGestion({
        managementNumber: values.managementNumber,
        flyerNumber: values.flyerNumber,
      }),
      this.mJobManagementService.deleteCopiesJobManagement4(
        values.managementNumber
      ),
      this.notificationService.update(values.flyerNumber, {
        dictumKey: '',
      }),
    ];
    await Promise.all(promises);
    this.formJobManagement.get('refersTo').setValue('D');
    this.se_refiere_a_Disabled.A = false;
    this.se_refiere_a_Disabled.B = false;

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
      this.pupSearchNumber(userInfo.delegationNumber);
      this.formJobManagement.get('statusOf').setValue('ENVIADO');
      //TODO: pup_act_gestion
      //TODO: Guardar m_job_gestion
      this.commit();
      this.pupShowReport();
    }
  }

  getValuesNotNull() {
    const values = this.formJobManagement.value;
    const keys = Object.keys(values);
    const result: any = {};
    keys.forEach(key => {
      if ((values as any)[key] != null) {
        result[key] = (values as any)[key];
      }
    });
    delete result.tipoTexto;
    if (values.addressee) {
      result.addressee =
        values.jobType == 'EXTERNO' ? values.addressee : values.addressee?.user;
    }
    if (values.sender) {
      result.sender = values.sender.id;
    }
    if (values.city) {
      result.city = values.city.id;
    }
    return result;
  }

  async commit() {
    if (this.isCreate) {
      const values = this.getValuesNotNull();
      values.jobBy =
        this.getParamsForName('PLLAMO') == 'ABANDONO'
          ? 'ABANDONO'
          : 'RELACIONADO';

      const result = await firstValueFrom(
        this.mJobManagementService.create(values).pipe(
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
    }
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
          this.pupAddGood();
        }
        if (
          valuesJobManagement.refersTo ==
          'Se refiere a algun (os) bien (es) del expediente'
        ) {
          this.pupAddAnyGood();
        }
        this.formVariables.get('classify').setValue(null);
        if (this.dataTableGoodsJobManagement?.[0].classify) {
          const auxArr: string[] = [];
          this.dataTableGoodsJobManagement.forEach(x => {
            if (x.classify) {
              // this.formVariables.get('classify').setValue(`${valuesVariables.classify || ''}${x.classify || ''}`);
              auxArr.push(x.classify as string);
            }
          });
          auxArr.length > 0 &&
            this.formVariables.get('classify').setValue(auxArr.join(','));
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
          this.pupAddGood();
        }
        if (
          valuesJobManagement.refersTo ==
            'Se refiere a algun (os) bien (es) del expediente' &&
          counter == 0
        ) {
          this.pupAddAnyGood();
        }

        this.formVariables.get('classify').setValue(null);
        if (this.dataTableGoodsJobManagement?.[0].classify) {
          const auxArr: string[] = [];
          this.dataTableGoodsJobManagement.forEach(x => {
            if (x.classify) {
              // this.formVariables.get('classify').setValue(`${valuesVariables.classify || ''}${x.classify || ''}`);
              auxArr.push(x.classify as string);
            }
          });
          if (auxArr.length > 0) {
            this.formVariables.get('classify').setValue(auxArr.join(','));
            this.formVariables.get('classify2').setValue(auxArr.join(','));
          }
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
  }

  sendFunction_pupLaunchReport(params: Object): Observable<any> {
    return this.dictationService.pupLaunchReport(params).pipe(map(x => x.data));
  }

  sendFunction_getVOficTrans(params: Object): Observable<any> {
    return this.dictationService
      .getVOficTrans(params)
      .pipe(map(x => x.data[0]));
  }
  sendFunction_nUniversalFolio(managementNumber: number): Observable<any> {
    return this.dictationService
      .nUniversalFolio(managementNumber)
      .pipe(map(x => x.data[0]));
  }
  sendFunction_getActnom(managementNumber: number): Observable<any> {
    return this.dictationService
      .getActnom(managementNumber)
      .pipe(map(x => x.data[0]));
  }
  sendFunction_pupValidExtDom(wheelNumber: number): Observable<any> {
    return this.dictationService.pupValidExtDom(wheelNumber).pipe(map(x => x));
  }
  sendFunction_findOffficeNu(params: Object): Observable<any> {
    return this.dictationService.findOffficeNu(params).pipe(map(x => x));
  }
  sendFunction_updateManagerTransfer(params: Object): Observable<any> {
    return this.dictationService
      .updateManagerTransfer(params)
      .pipe(map(x => x.data));
  }
  sendFunction_ObtainKeyOffice(params: Object): Observable<any> {
    return this.msOfficeManagementService
      .ObtainKeyOffice(params)
      .pipe(map(x => x));
  }
  sendFunction_pufGenerateKey(params: IPufGenerateKey): Observable<any> {
    return (
      this.dictationService.pufGenerateKey(params).subscribe({
        error: error => {
          this.alertInfo(
            'warning',
            'No se puede guardar por la siguiente razón:',
            error.error.message
          );
          console.log('Error', error);
        },
      }),
      this.dictationService.pufGenerateKey(params).pipe(map(x => x))
    );
  }
  sendFunction_pupStatusChange(params: IStatusChange): Observable<any> {
    return this.dictationService.pupStatusChange(params).pipe(map(x => x));
  }
  sendFunction_createMJobManagementExtSSF3(
    params: IMJobManagementExtSSF3
  ): Observable<any> {
    return this.msOfficeManagementService
      .createMJobManagementExtSSF3(params)
      .pipe(map(x => x));
  }

  openDialogSelectedManagement(data?: IListResponse<IMJobManagement>): any {
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
}
