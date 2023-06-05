import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, skip } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import {
  IAccesTrackingXArea,
  IUsersTracking,
} from 'src/app/core/models/ms-security/pup-user.model';
import {
  IDetailGoodPossessionThirdParty,
  IGoodPossessionThirdParty,
} from 'src/app/core/models/ms-thirdparty-admon/third-party-admon.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GOODS_COLUMNS,
  GOODS_COLUMNS2,
  NOTIFICATIONS_COLUMNS,
} from './thirdparties-possession-validation-columns';
import { thirdpartiesPossessionValidationResponses } from './thirdparties-possession-validation-responses';

type IGoodAndAvailable = IGood & { available?: boolean };
const predifinedText =
  'En cumplimiento a la instrucción judicial derivada del juicio de amparo <A> por el cual se informa que se resolvió provisionalmente conceder al quejoso la restitución de la posesión  uso y disfrute  del(los) siguiente(s) mueble(s). Al respecto me permito señalar: \n\n<B> \n\n<C> \n\nCon fundamento en la fracción XIV del artículo 39 del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes y considerando la instrucción judicial deducida del juicio de garantías emitida por el Juez <DATOS DE JUZGADO>, por el cual se otorga la suspensión definitiva al quejoso <QUEJOSO> respecto del disfrute del inmueble de marras y, consecuentemente, la restitución de la posesión, en tal sentido y salvo que no exista aseguramiento anterior o posterior decretado por autoridad competente para ello, esa Delegación a su cargo deberá dar cabal cumplimiento a la suspensión definitiva, levantado para tal efecto el acta administrativa de entrega de posesión por virtud de suspensión provisional, afectando, consecuentemente, el SIAB bajo el estatus "PD3" "entrega en posesión a terceros por instrucción judicial". \n\nEl cumplimiento señalado, deberá realizarlo a la brevedad e informar al Juez de Amparo sobre los actos tendientes a su cumplimiento. \n\nNo omito señalar, que en el supuesto de que se resuelva el amparo en el cuaderno incidental y/o principal negando la protección de la justicia federal, se deberán llevar a cabo las acciones legales correspondientes para recuperar la posesión del inmueble asegurado. \n\nFinalmente, le informo que debe hacer del conocimiento de la autoridad que decretó el aseguramiento, así como, en su caso, del Juez que conozca del proceso penal federal. \n\nQuedo a sus órdenes para cualquier comentario.';
interface IUserCustom {
  nombre: string;
  usuario: string;
  nameUser: string;
}
@Component({
  selector: 'app-thirdparties-possession-validation',
  templateUrl: './thirdparties-possession-validation.component.html',
  styleUrls: ['./thirdparties-possession-validation.component.scss'],
})
export class ThirdpartiesPossessionValidationComponent
  extends thirdpartiesPossessionValidationResponses
  implements OnInit, OnDestroy
{
  users: ISegUsers[] = [];
  dataTableNotifications: INotification[] = [];
  // Table settings
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsNotifications = new BehaviorSubject<ListParams>(new ListParams());
  selectedRows: IGoodAndAvailable = {};
  selectedRows2: {
    possessionNumber?: number;
    goodNumber: number;
    steeringwheelNumber?: number;
    nbOrigin?: string;
    status?: any;
    id?: number;
    description?: string;
  } | null = null;
  wheelNotifications: INotification;
  goodsPosessionThirdParty: IGoodPossessionThirdParty[] = [];

  tableSettingsNotificaciones = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    // mode: 'external', // ventana externa

    columns: NOTIFICATIONS_COLUMNS,
  };

  // Table settings
  tableSettingsBienes = {
    selectedRowIndex: -1,
    rowClassFunction: (row: any) => {
      if (!row.data.available) {
        return 'bg-dark text-white disabled-custom';
      } else {
        return 'bg-success text-white';
      }
    },
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    selectMode: 'none',
    hideSubHeader: true, //oculta subheaader de filtro
    // mode: 'external', // ventana externa

    columns: GOODS_COLUMNS2,
  };
  // Data table
  dataTableBienes: IGoodAndAvailable[] = [];

  // Table settings
  tableSettingsBienesOficio = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    selectedRowIndex: -1,

    selectMode: 'single',
    hideSubHeader: true,
    mode: 'external',

    columns: GOODS_COLUMNS,
  };
  dataTableBienesOficio: {
    possessionNumber?: number;
    goodNumber: number;
    steeringwheelNumber?: number;
    nbOrigin?: string;
    status?: any;
    id?: number;
    description?: string;
  }[] = [];

  expedientNumber: number = 0;
  // public form: FormGroup;
  // public formCcpOficio: FormGroup;
  public noExpediente = new FormControl(null);
  // public formGood: FormGroup;
  totalItemsNotificaciones: number = 0;

  isLoadingGood: boolean = false;
  paramsGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGood: number = 0;
  notificationSelected: null | INotification = null;
  addressee = new DefaultSelect();
  userCcp1 = new DefaultSelect();
  userCcp2 = new DefaultSelect();
  userResponsible = new DefaultSelect();
  isAllDisabled: boolean = false;
  constructor(
    // private fb: FormBuilder,
    private notificationService: NotificationService,
    private goodService: GoodService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    // private historyGoodService: HistoryGoodService,
    protected goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    protected userService: UsersService,
    private authService: AuthService,
    private securityService: SecurityService,
    private departmentService: DepartamentService,
    protected parametersService: ParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.loading = true;
    this.paramsNotifications.subscribe(params => {
      this.getNotifications(params);
    });

    this.paramsGood.pipe(skip(1)).subscribe(params => {
      this.getGoods(params);
    });
    // this.noExpediente.valueChanges // .get('noExpediente')
    //   .pipe(debounceTime(500))
    //   .subscribe(x => {
    //     this.getNotifications();
    //   });

    // this.form
    //   .get('wheelNumber')
    //   .valueChanges.pipe(debounceTime(500))
    //   .subscribe(x => {
    //     this.getNotificationByWheel(new ListParams(), x);
    //     this.getGoodsPosessionThird(new ListParams(), x);
    //   });
    // this.form
    //   .get('wheelNumber')
    //   .valueChanges.pipe(debounceTime(500))
    //   .subscribe(x => {
    //     this.getNotificationByWheel(new ListParams(), x);
    //     this.getGoodsPosessionThird(new ListParams(), x);
    //   });
  }

  formPositionThirdParty = new FormGroup({
    closingDate: new FormControl(''),
    delegationCloseNumber: new FormControl<string | number>('0'),
    jobKey: new FormControl(''),
    nbOrigin: new FormControl(''),
    numClueNavy: new FormControl<string | number>('0'),
    possessionNumber: new FormControl(null),
    steeringwheelNumber: new FormControl(null),
    text: new FormControl('', Validators.required),
    usrAddressee: new FormControl<IUserCustom>(null, Validators.required),
    usrCcp1: new FormControl<IUserCustom>(null, Validators.required),
    usrCcp2: new FormControl<IUserCustom>(null, Validators.required),
    usrResponsible: new FormControl<IUserCustom>(null, Validators.required),
    addressee: new FormControl(null),
  });

  getCurrentDateFormat() {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  selectRowNotification(event: any) {
    this.notificationSelected = event.data;
    this.formPositionThirdParty.reset();
    this.formPositionThirdParty.enable();
    this.isAllDisabled = false;
    this.formPositionThirdParty
      .get('steeringwheelNumber')
      .setValue(this.notificationSelected.wheelNumber);
    this.getGoodsPosessionThird();
    this.getGoods(new ListParams());
  }

  getRelationsSelected() {
    const { usrAddressee, usrCcp1, usrCcp2, usrResponsible } =
      this.formPositionThirdParty.value;
    const params = new ListParams();
    console.log(this.formPositionThirdParty.value);
    if (usrAddressee) {
      // params['text'] = usrAddressee.usuario;
      this.getUser(usrAddressee.usuario).subscribe({
        next: data => {
          this.formPositionThirdParty.get('usrAddressee').setValue({
            nameUser: `${usrAddressee.usuario} - ${data.nombre || ''}`,
            nombre: data.nombre,
            usuario: usrAddressee.usuario,
          });
        },
      });
    }
    if (usrCcp1) {
      this.getUser(usrCcp1.usuario).subscribe({
        next: data => {
          this.formPositionThirdParty.get('usrCcp1').setValue({
            nameUser: `${usrCcp1.usuario} - ${data.nombre || ''}`,
            nombre: data.nombre,
            usuario: usrCcp1.usuario,
          });
        },
      });
    }
    if (usrCcp2) {
      this.getUser(usrCcp2.usuario).subscribe({
        next: data => {
          this.formPositionThirdParty.get('usrCcp2').setValue({
            nameUser: `${usrCcp2.usuario} - ${data.nombre || ''}`,
            nombre: data.nombre,
            usuario: usrCcp2.usuario,
          });
        },
      });
    }
    if (usrResponsible) {
      this.getUser(usrResponsible.usuario).subscribe({
        next: data => {
          this.formPositionThirdParty.get('usrResponsible').setValue({
            nameUser: `${usrResponsible.usuario} - ${data.nombre || ''}`,
            nombre: data.nombre,
            usuario: usrResponsible.usuario,
          });
        },
      });
    }
  }

  getGoodsPosessionThird() {
    const wheelNumber = this.notificationSelected.wheelNumber;
    if (!wheelNumber) {
      return;
    }
    const queryParams = `page=${1}&limit=${10}&filter.steeringwheelNumber=${wheelNumber}`;
    this.dataTableBienesOficio = [];
    this.goodPosessionThirdpartyService.getAll(queryParams).subscribe({
      next: dataGoodPosessionThirdParty => {
        const goodPosessionThirdParty = dataGoodPosessionThirdParty.data[0];
        this.formPositionThirdParty.patchValue({
          ...goodPosessionThirdParty,
          usrAddressee: {
            nombre: '',
            usuario: goodPosessionThirdParty.usrAddressee,
            nameUser: goodPosessionThirdParty.usrAddressee,
          },
          usrCcp1: {
            nombre: '',
            usuario: goodPosessionThirdParty.usrCcp1,
            nameUser: goodPosessionThirdParty.usrCcp1,
          },
          usrCcp2: {
            nombre: '',
            usuario: goodPosessionThirdParty.usrCcp2,
            nameUser: goodPosessionThirdParty.usrCcp2,
          },
          usrResponsible: {
            nombre: '',
            usuario: goodPosessionThirdParty.usrResponsible,
            nameUser: goodPosessionThirdParty.usrResponsible,
          },
          closingDate: goodPosessionThirdParty?.closingDate,
          // ? new Date(goodPosessionThirdParty?.closingDate)
          // : null,
        });

        const jobKey = this.formPositionThirdParty.value?.jobKey;
        if (jobKey && !jobKey?.includes('?')) {
          this.isAllDisabled = true;
          this.formPositionThirdParty.disable();
        }
        this.getRelationsSelected();
        if (goodPosessionThirdParty?.possessionNumber) {
          this.goodPosessionThirdpartyService
            .getAllDetailGoodPossessionThirdParty(
              'filter.possessionNumber=' +
                goodPosessionThirdParty.possessionNumber
            )
            .subscribe({
              next: data => {
                this.dataTableBienesOficio = data.data.map(x => {
                  return {
                    ...x,
                    goodNumber: x.goodNumber.id as any,
                    description: x.goodNumber.description,
                    status: x.goodNumber.status,
                    available: false,
                  };
                });
                console.log('data table', this.dataTableBienesOficio);
                // this.dataTableBienesOficio.forEach((element, index) => {
                //   this.dataTableBienes.find(
                //     x => x.id === element.goodNumber
                //   ).available = false;
                // });
                // this.goodService
                //   .getById(this.detailGoodPosessionThirdParty.goodNumber)
                //   .subscribe({
                //     next: (data: any) => {
                //       console.log('data good', data);
                //       this.detailGoodPosessionThirdParty['description'] =
                //         data.data[0].description;
                //       this.detailGoodPosessionThirdParty['status'] =
                //         data.data[0].status;
                //     },
                //   });
              },
              error: () => {},
            });
        }
        // this.isLoadingGood = false;
      },
    });
  }

  getNotificationByWheel(params: ListParams) {
    const wheelNumber = this.formPositionThirdParty.get(
      'steeringwheelNumber'
    ).value;
    if (!wheelNumber) {
      return;
    }
    const queryParams = `page=${params.page}&limit=${params.limit}&filter.wheelNumber=${wheelNumber}`;

    this.notificationService.getAllFilter(queryParams).subscribe({
      next: data => {
        this.wheelNotifications = data.data[0];

        this.totalItemsNotificaciones = data.count;

        this.totalItemsNotificaciones = data.count;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  clearForm() {
    this.formPositionThirdParty.reset();
    this.formPositionThirdParty.reset();
    this.noExpediente.reset();
    // this.formGood.reset();
    this.dataTableBienes = [];
    this.dataTableBienesOficio = [];
    this.dataTableNotifications = [];
    this.wheelNotifications = null;
  }

  searchInput() {
    this.dataTableNotifications = [];
    this.dataTableBienesOficio = [];
    this.dataTableBienes = [];
    // this.form.reset();
    this.formPositionThirdParty.reset();
    // this.formGood.reset();
    this.wheelNotifications = null;
    this.paramsNotifications.next(new ListParams());
  }

  getNotifications(params = new ListParams()) {
    const numberExpedient = this.noExpediente.value;
    this.expedientNumber = numberExpedient;
    if (!numberExpedient) {
      this.dataTableNotifications = [];
      this.dataTableBienesOficio = [];
      this.dataTableBienes = [];
      // this.form.reset();
      this.formPositionThirdParty.reset();
      // this.formGood.reset();
      this.wheelNotifications = null;
      return;
    }
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    let queryString = `page=${params.page}&limit=${params.limit}`;
    queryString += `&filter.expedientNumber=${numberExpedient}`;

    this.dataTableNotifications = [];
    this.loading = true;
    this.notificationService.getAllFilter(queryString).subscribe({
      next: data => {
        this.dataTableNotifications = data.data;
        this.totalItemsNotificaciones = data.count;
        this.loading = false;
        this.notificationSelected = this.dataTableNotifications[0];
        this.getGoods(new ListParams());
      },
      error: () => {
        this.loading = false;
      },
    });
    this.dataTableBienes = [];
    this.dataTableBienesOficio = [];
  }

  getGoods(params: ListParams) {
    const numberExpedient = this.noExpediente.value;
    this.dataTableBienes = [];
    const queryString = `page=${params.page}&limit=${params.limit}&filter.fileNumber=${numberExpedient}`;

    this.isLoadingGood = true;
    this.goodService.getAllFilter(queryString).subscribe({
      next: async data => {
        const r = await data.data.map(async (item: any) => {
          let isNotAvailable = Boolean(
            this.dataTableBienesOficio.find(x => x.id == item.id)
          );
          console.log('isNotAvailable', isNotAvailable);
          if (item.status == 'ADM' && !isNotAvailable) {
            try {
              const result = await this.getDetailGoodThirdParty(item.id, true);
              isNotAvailable = true;
            } catch (e) {
              isNotAvailable = false;
            }
          }
          return {
            ...item,
            available: item.status != 'ADM' || isNotAvailable ? false : true,
          };
        });
        this.dataTableBienes = await Promise.all(r);
        this.totalItemsGood = data.count;
        this.isLoadingGood = false;
      },
      error: () => {
        this.isLoadingGood = false;
      },
    });
  }

  rowSelected(rows: any) {
    this.selectedRows = rows.isSelected ? rows.data : {};
  }

  rowSelected2(rows: any) {
    this.selectedRows2 = rows.isSelected ? rows.data : {};
  }

  async addGoodOffice() {
    if (Object.keys(this.selectedRows).length < 1) {
      this.alert(
        'info',
        'Selecciona un bien',
        'Selecciona un bien para poder realizar esta acción.'
      );
      return;
    }

    if (!this.selectedRows?.available) {
      this.alert(
        'info',
        'Bien no disponible',
        'El bien seleccionado no está disponible.'
      );
      return;
    }
    console.log('this.selectedRows', this.selectedRows);
    const body = {
      goodNumber: this.selectedRows.id as any,
      id: this.selectedRows.id,
      possessionNumber: this.formPositionThirdParty.value?.possessionNumber,
      steeringwheelNumber: (this.selectedRows.flyerNumber as any) || '',
      description: this.selectedRows.description,
      status: this.selectedRows.status,
      nbOrigin: '',
    };
    if (this.formPositionThirdParty?.value?.jobKey?.includes('?')) {
      try {
        await this.postDetailGoodPossessionThirdParty(body);
      } catch (e) {
        this.alert(
          'info',
          'No se puede insertar el bien',
          'No se puede insertar el bien inténtelo de nuevo.'
        );
        return;
      }
    }

    this.dataTableBienesOficio = [...this.dataTableBienesOficio, body];
    this.dataTableBienes.find(x => x.id === this.selectedRows.id).available =
      false;

    // this.goodService
    //   .updateGoodStatus(this.selectedRows.goodId, 'STI')
    //   .subscribe({
    //     next: data => {
    //       this.handleSuccess();
    //       this.selectedRows = {};
    //     },
    //     error: () => (this.loading = false),
    //   });
  }

  handleSuccess() {
    this.getGoods(new ListParams());
    this.alert('success', 'Excelente', 'Se ha agregado el bien correctamente');
    this.loading = false;
  }

  async deleteGoodOffice() {
    if (Object.keys(this.selectedRows2).length < 1) {
      this.alert(
        'info',
        'Selecciona un bien',
        'Selecciona un bien para poder realizar esta acción.'
      );
      return;
    }

    if (this.formPositionThirdParty?.value?.jobKey?.includes('?')) {
      try {
        await this.deleteDetailGoodPossessionThirdParty({
          possessionNumber: this.formPositionThirdParty.value.possessionNumber,
          goodNumber: this.selectedRows2.goodNumber,
        });
      } catch (e) {
        this.alert(
          'info',
          'No se puede eliminar',
          'No se puede eliminar el bien porque ya se encuentra en un oficio.'
        );
        return;
      }
    }

    const item = this.dataTableBienes.find(
      x => x.id === (this.selectedRows2 as any)['goodNumber']
    );
    if (item) item.available = true;
    this.dataTableBienesOficio = this.dataTableBienesOficio.filter(
      x => x.goodNumber !== (this.selectedRows2 as any)['goodNumber']
    );

    // this.goodService
    //   .updateGoodStatus(this.selectedRows2.goodId, 'ADM')
    //   .subscribe({
    //     next: data => {
    //       this.handleSuccess();
    //       this.selectedRows2 = {};
    //     },
    //     error: () => (this.loading = false),
    //   });
  }

  mostrarInfo(form: any): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }

  async sendForm() {
    console.log('sendForm');
    if (
      this.dataTableBienesOficio.length < 1 ||
      !this.formPositionThirdParty.value?.jobKey
    ) {
      this.alert(
        'error',
        'Error',
        'No puede cerrar el Acta si no se han incorporado bienes y generado la clave armada.'
      );
      return;
    }

    if (this.formPositionThirdParty.invalid) {
      this.formPositionThirdParty.markAllAsTouched();
      showToast({
        icon: 'error',
        text: 'Faltan campos por llenar',
        title: 'Error',
      });
      return;
    }

    if (this.formPositionThirdParty.value.jobKey.includes('?')) {
      // const year = this.formPositionThirdParty.value.jobKey.substring(
      //   this.formPositionThirdParty.value.jobKey.lastIndexOf('/') + 1,
      //   this.formPositionThirdParty.value.jobKey.length
      // );
      const cveOficio = this.formPositionThirdParty.value.jobKey;
      const slashIndex: number = cveOficio.length;
      const year: string = cveOficio.substring(slashIndex - 4, slashIndex);

      const toolbar_no_delegacion = this.authService.decodeToken().department;
      const office = await firstValueFrom(
        this.goodPosessionThirdpartyService
          .postThirdPartyAdmonOffice({
            toolbarDelegationNumber: toolbar_no_delegacion,
            year: year,
          })
          .pipe(map((res: any) => res.data[0].job))
      );

      this.formPositionThirdParty
        .get('closingDate')
        .setValue(this.getCurrentDateFormat());
      this.formPositionThirdParty.get('numClueNavy').setValue(office);
      this.formPositionThirdParty
        .get('delegationCloseNumber')
        .setValue(toolbar_no_delegacion as any);

      this.formPositionThirdParty
        .get('jobKey')
        .setValue(
          this.formPositionThirdParty
            .get('jobKey')
            .value?.replace('?', office.toString().padStart(5, '0'))
            .replace(' ', '')
        );

      let key = 0;
      try {
        // 	BEGIN
        //    SELECT COUNT(0)
        //      INTO CLAVE
        //      FROM BIEN_POSESION_TERCERO
        //     WHERE NO_DELEGACION_CIERRA = :blk_toolbar.toolbar_no_delegacion
        //       AND CVE_OFICIO = :BIEN_POSESION_TERCERO.CVE_OFICIO
        //       AND CVE_OFICIO NOT LIKE '%?%';
        // EXCEPTION
        // 	 WHEN OTHERS THEN
        // 	 CLAVE := 0;
        // END;
        key = await firstValueFrom(
          this.goodPosessionThirdpartyService
            .postThirdPartyAdmonKey({
              toolbarDelegationNumber: toolbar_no_delegacion,
              jobKey: this.formPositionThirdParty.value.jobKey,
            })
            .pipe(map((res: any) => res.data[0].key))
        );
      } catch (error) {
        key = 0;
      }

      if (key > 1) {
        this.alert(
          'error',
          'Error',
          'Fatal ERROR ir al área de sistemas hay más de una clave armada con el mismo número.'
        );
        return;
      }
      await this.commitSilent();
      this.isAllDisabled = true;
      this.formPositionThirdParty.disable();

      this.alert('success', 'Información', 'Enviando');
    } else {
      this.alert('info', 'Información', 'La clave ya a sido enviada.');
    }
  }

  btnInsertarTextoPredefinido() {
    this.formPositionThirdParty.get('text').setValue(predifinedText);
  }

  btnReemplazarMarcadores() {
    if (!this.formPositionThirdParty.get('text').value) {
      this.alert('warning', 'Atención', 'No hay texto para reemplazar.');
    }
    const queryParams = `filter.wheelNumber=${this.formPositionThirdParty.value.steeringwheelNumber}`;
    this.notificationService.getAllFilter(queryParams).subscribe({
      next: data => {
        let tGoods = '';
        this.dataTableBienesOficio.forEach((element, index) => {
          tGoods += `${element?.goodNumber} ${element?.description}.\n`;
        });
        let replaceText = predifinedText.replaceAll(
          '<A>',
          // this.wheelNotifications
          //   ? this.wheelNotifications.protectionKey
          data.data[0].protectionKey || '<A>'
        );
        const text = this.formPositionThirdParty.get('text').value;
        if (text) {
          text.replace('<A>', data.data[0].protectionKey);
          replaceText = replaceText.replaceAll('<B>', 'BIEN  DESCRIPCIÓN');
          replaceText = replaceText.replaceAll('<C>', tGoods);
          this.formPositionThirdParty.get('text').setValue(replaceText);
        }
      },
      error: err => {},
    });
  }

  onClickPrint() {
    if (this.formPositionThirdParty.invalid) {
      this.formPositionThirdParty.markAllAsTouched();
      this.alert('info', '', 'Revisa los campos');
      return;
    }
    if (this.dataTableBienesOficio.length < 1) {
      this.alert('info', '', 'Seleccione un bien');
      return;
    }
    if (!this.formPositionThirdParty.get('jobKey').value) {
      const isReturn = this.pupGeneratorKey();
      if (isReturn) return;
      this.pupPrint();
    } else {
      this.pupPrint();
    }
  }

  async pupGeneratorKey() {
    const values = this.formPositionThirdParty.value;
    if (!values.usrResponsible) {
      this.alert('info', '', 'Debe especificar el Responsable.');
      return true;
    }
    if (!values.usrAddressee) {
      this.alert('info', '', 'Debe especificar el Destinatario.');
      return true;
    }
    if (!values.jobKey) {
      let segAccessXAreas, _segAccessXAreas;
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
        return true;
      }

      try {
        const params = {
          'filter.user': values.usrResponsible.usuario,
          'filter.assigned': 'S',
        };
        segAccessXAreas = (await this.getSegAccessXAreas(
          params
        )) as IAccesTrackingXArea;

        segUser = (await this.getSegUsers({
          'filter.user': values.usrResponsible.usuario,
        })) as IUsersTracking;
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se localizaron datos de la persona que autoriza.'
        );
        return true;
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
              return true;
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
          return true;
        }
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se localizó la dependencia de la persona que autoriza.'
        );
        return true;
      }

      try {
        const params = {
          'filter.user': values.usrAddressee.usuario,
          'filter.assigned': 'S',
        };
        _segAccessXAreas = (await this.getSegAccessXAreas(
          params
        )) as IAccesTrackingXArea;
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se localizaron datos del destinatario.'
        );
        throw ex;
      }

      const paramsDepartment = new ListParams();
      paramsDepartment['filter.numDelegation'] =
        _segAccessXAreas.delegationNumber;
      paramsDepartment['filter.id'] = _segAccessXAreas.departmentNumber;
      paramsDepartment['filter.phaseEdo'] = faEtapaCreada;
      const __department = await this.getDepartment(paramsDepartment, false);
      const year = new Date().getFullYear().toString();
      // const month = (new Date().getMonth() + 1).toString();

      let joyKey = `${level2}/${level3}/${level4}`;
      if (
        department.level &&
        !isNaN(department.level as any) &&
        Number(department.level) + 1 == 5
      ) {
        joyKey += `/${level5}`;
      }
      joyKey += `/?/${year}`.trim();
      this.formPositionThirdParty.get('jobKey').setValue(joyKey);
    }
    this.pupPrint();
    return false;
  }

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

  async commitSilent() {
    if (this.isAllDisabled) {
      return;
    }
    const values = this.formPositionThirdParty.value;
    const body = {
      ...values,
      numClueNavy: values.numClueNavy || 0,
      delegationCloseNumber: values.delegationCloseNumber || 0,
      usrCcp1: values.usrCcp1?.usuario || '',
      usrCcp2: values.usrCcp2?.usuario || '',
      usrResponsible: values.usrResponsible.usuario || '',
      usrAddressee: values.usrAddressee.usuario || '',
      nbOrigin: values.nbOrigin || '',
      closingDate: this.getCurrentDateFormat(),
    };
    delete body.addressee;
    // delete body.nbOrigin;
    if (this.formPositionThirdParty.value.possessionNumber) {
      await this.updateGoodPossessionThirdParty(
        this.formPositionThirdParty.value.possessionNumber,
        body as any
      );
      // if (!this.formPositionThirdParty.value?.jobKey) {
      // this.dataTableBienesOficio.forEach(async element => {
      //   const __body: IDetailGoodPossessionThirdParty = {
      //     // ...element,
      //     possessionNumber:
      //       this.formPositionThirdParty.value.possessionNumber,
      //     nbOrigin: '',
      //     goodNumber: element.goodNumber as any,
      //     steeringwheelNumber: element.steeringwheelNumber as any,
      //   };
      //   await this.postDetailGoodPossessionThirdParty(__body);
      // });
      // }
    } else {
      const _body: IGoodPossessionThirdParty = {
        closingDate: this.getCurrentDateFormat(),
        jobKey: body.jobKey,
        nbOrigin: body.nbOrigin,
        delegationCloseNumber: body.delegationCloseNumber as any,
        numClueNavy: body.numClueNavy as any,
        possessionNumber: body.possessionNumber,
        usrCcp1: body.usrCcp1,
        usrCcp2: body.usrCcp2,
        usrResponsible: body.usrResponsible,
        usrAddressee: body.usrAddressee,
        steeringwheelNumber: body.steeringwheelNumber,
        text: body.text,
      };
      try {
        _body.possessionNumber = await this.getSequenceNoPositionNextVal();
        Object.keys(_body).forEach((key: any) => {
          if (!(_body as any)[key]) {
            (_body as any)[key] = '';
          }
        });
        if (!_body.possessionNumber) {
          throw new Error('No se pudo generar el número de posesión.');
        }
        this.formPositionThirdParty
          .get('possessionNumber')
          .setValue(_body.possessionNumber);
        await this.postGoodPossessionThirdParty(_body);
      } catch (ex) {
        this.alert(
          'error',
          'Error',
          'No se pudo generar el número de posesión.'
        );
        throw ex;
      }
      this.dataTableBienesOficio.forEach(async element => {
        const __body: IDetailGoodPossessionThirdParty = {
          // ...element,
          possessionNumber: this.formPositionThirdParty.value.possessionNumber,
          nbOrigin: '',
          goodNumber: element.goodNumber as any,
          steeringwheelNumber: element.steeringwheelNumber as any,
        };
        await this.postDetailGoodPossessionThirdParty(__body);
      });
    }
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

  async pupPrint() {
    await this.commitSilent();
    const params = {
      // PARAMFORM: 'NO',
      // P_FIRMA: 'S',
      P_NO_POSESION: this.formPositionThirdParty.value.possessionNumber || '',
    };

    this.siabService
      .fetchReport('FBIEVALPOSTERCERO', params)
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

  getUserName(
    params: ListParams,
    type: 'addressee' | 'ccp1' | 'ccp2' | 'responsible' = 'addressee'
  ) {
    params['asigUser'] = 'S';
    this.userService.getAllUsersAsigne(params).subscribe({
      next: (data: { data: any[]; count: number }) => {
        const res = data.data.map(item => {
          return { ...item, nameUser: `${item.usuario} - ${item.nombre}` };
        });
        switch (type) {
          case 'addressee':
            this.addressee = new DefaultSelect(res, data.count);
            break;
          case 'ccp1':
            this.userCcp1 = new DefaultSelect(res, data.count);
            break;
          case 'ccp2':
            this.userCcp2 = new DefaultSelect(res, data.count);
            break;
          case 'responsible':
            this.userResponsible = new DefaultSelect(res, data.count);
        }
        // this.addressee = new DefaultSelect(res, data.count);
      },
    });
  }
}
