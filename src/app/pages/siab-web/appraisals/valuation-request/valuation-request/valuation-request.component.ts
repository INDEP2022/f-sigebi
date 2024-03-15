import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IModComerOffice } from 'src/app/core/models/ms-officemanagement/mod-comer-office';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AppraisesService } from 'src/app/core/services/ms-appraises/appraises.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { VALUATION_REQUEST_COLUMNS } from './valuation-request-columns';

@Component({
  selector: 'app-valuation-request',
  templateUrl: './valuation-request.component.html',
  styles: [],
})
export class valuationRequestComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  user: string;
  event: number = 0;
  tipo: any;
  m_comer: IModComerOffice;
  v_evento: number;
  v_usuario: string;
  titulo_oficio: string;
  title: string = '';
  address: string;
  estatus: string;
  mes: string;
  sender = new DefaultSelect();
  addressee = new DefaultSelect();
  usersList = new DefaultSelect();
  cityList = new DefaultSelect();
  existe: string;
  oficio: string;
  idOficio: number;
  oficio_clave: string;
  num_armada: string;
  addUser: boolean = false;
  removeUser: boolean = false;
  searchChanges: boolean = false;
  sendFi: boolean = false;
  viewOf: boolean = false;
  lsbConCopiaList: any[] = [];
  lsbConCopiaListSelect = new DefaultSelect();
  usuariocopia: any;
  usuariocopiaDelete: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventAppService: EventAppService,
    private officeManagementService: OfficeManagementService,
    private findicaService: FIndicaService,
    private generateCveService: GenerateCveService,
    private cityService: CityService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private appraisesService: AppraisesService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private router: Router
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };
    this.m_comer = new IModComerOffice();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.user = params['user'];
      } else {
        this.user = localStorage.getItem('username');
      }
      if (params['event']) {
        this.event = params['event'];
        this.form.controls['event'].setValue(this.event);
        this.getsContent();
      }
    });
    // this.getsContent();
    // 23959- 23496 - 23972 - 6185

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        this.event = params['event'];
      });
    this.user = localStorage.getItem('username');
    // this.event = 6185;
    // this.form.controls['event'].setValue(this.event);
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      cveService: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      folio: [null, [Validators.required]],

      sender: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      senderTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addresseeTxt: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      paragraph1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraph2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraph3: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      user: [null, [Validators.required]],
      txtUserCCP: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      lsbConCopiaCCP: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  async getsContent() {
    this.loader.load = true;
    if (this.event == 0) {
      this.event = this.form.controls['event'].value;
    }
    let type = await this.getType(this.event);
    console.log(type);
    this.tipo = type;

    // if (Number(this.tipo.tipoevento) != 10) {
    //   this.alert('warning', 'El evento no es valido', '');
    //   this.clear();
    //   console.log(this.tipo.tipoevento);
    //   return;
    // }
    // if ((this.tipo.id_estatusvta != "PREP") && (this.tipo.id_estatusvta != "APRO") && (this.tipo.id_estatusvta != "SOLV") && (this.tipo.id_estatusvta != "VALV")) {
    //   this.alert('warning', 'El evento no es valido', '');
    //   console.log(this.tipo.id_estatusvta);
    //   this.clear();
    //   return;
    // }
    if (this.tipo.direccion == 'I') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' INMUEBLES';
      this.address = this.tipo.direccion;
    } else if (this.tipo.direccion == 'M') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' MUEBLES';
      this.address = this.tipo.direccion;
    } else if (this.tipo.direccion == 'A') {
      this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' ACTIVOS FINANCIEROS';
      this.address = this.tipo.direccion;
    }
    // if ((this.tipo.valor == '') || (this.tipo.valor == null)) {
    //   this.alert('warning', 'El evento no tiene asignado un tipo de oficio', '');
    //   this.clear();
    //   return;
    // }
    let mComer = await this.getTrade(this.event);
    console.log(mComer);
    if (mComer != null) {
      this.m_comer = mComer;
    }
    console.log(this.m_comer.estatus_of);
    if (this.m_comer.estatus_of != null || this.m_comer.estatus_of == '') {
      this.estatus = this.m_comer.estatus_of;
    } else {
      this.estatus = 'GENERADO';
    }
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.loadGrid(this.event, this.estatus);
    });

    let data_rem: any = await this.getUsers(1);
    console.log(data_rem);
    this.sender = new DefaultSelect(data_rem.data, data_rem.count);
    let data_sed: any = await this.getUsers(2);
    this.addressee = new DefaultSelect(data_sed.data, data_sed.count);
    this.usersList = new DefaultSelect(data_sed.data, data_sed.count);
    if (
      this.m_comer.remitente != null &&
      this.m_comer.remitente != '' &&
      this.m_comer.remitente != undefined
    ) {
      console.log(this.user);
      this.form.controls['sender'].setValue(this.m_comer.remitente);
    } else {
      console.log(this.user);
      let user: any = await this.getUsersFilter(1, this.user);
      this.form.controls['sender'].setValue(user != null ? user.usuario : null);
    }
    if (
      this.m_comer.destinatario != null &&
      this.m_comer.remitente != undefined
    ) {
      this.form.controls['addressee'].setValue(this.m_comer.destinatario);
    }
    if (this.m_comer.estatus_of != null) {
      if (this.m_comer.estatus_of == 'ENVIADO') {
        this.controlControls();
      }
    }
    if (this.m_comer.ciudad != null && this.m_comer.ciudad != undefined) {
      let city: any = await this.getCities(
        new ListParams(),
        this.m_comer.ciudad
      );
      this.cityList = new DefaultSelect(city.data, city.count);
      this.form.controls['city'].setValue(this.m_comer.ciudad);
    } else {
      let city: any = await this.getCities(new ListParams(), '266');
      this.cityList = new DefaultSelect(city.data, city.count);
      this.form.controls['city'].setValue('266');
    }
    let city: any = await this.getCities(new ListParams());
    this.cityList = new DefaultSelect(city.data, city.count);
    console.log(this.m_comer);
    if (this.m_comer.cve_oficio != null) {
      this.existe = 'SI';
      this.oficio = this.m_comer.cve_oficio.toString();
      this.oficio_clave = this.m_comer.cve_oficio;
      this.num_armada = this.m_comer.num_cv_armada;
      this.loadControls();
    } else {
      this.form.controls['cveService'].setValue('');
      let folio = await this.getFolio(1, 0);
      this.form.controls['folio'].setValue(folio);
    }
    console.log(this.tipo.direccion);
    if (this.tipo.direccion == 'I') {
      let text1 = await this.getText('SOL1_I');
      let text2 = await this.getText('SOL2_I');
      let text3 = await this.getText('SOL3_I');
      this.form.controls['paragraph1'].setValue(text1);
      this.form.controls['paragraph2'].setValue(text2);
      this.form.controls['paragraph3'].setValue(text3);
    } else {
      let tex1 = await this.getText('SOL1_M');
      let tex2 = await this.getText('SOL2_M');
      let tex3 = await this.getText('SOL3_M');
      console.log(tex3);
      this.form.controls['paragraph1'].setValue(tex1);
      this.form.controls['paragraph2'].setValue(tex2);
      this.form.controls['paragraph3'].setValue(tex3);
    }
    console.log(this.m_comer.id_oficio);
    if (this.m_comer.id_oficio != 0 && this.m_comer.id_oficio != undefined) {
      this.idOficio = this.m_comer.id_oficio;
      this.lsbConCopiaList = [];
      let usuOfico: any = await this.getUserOt(this.m_comer.id_oficio);
      console.log(usuOfico);
      if (usuOfico != 0 && usuOfico != undefined) {
        usuOfico.data.forEach((element: any) => {
          this.lsbConCopiaList.push(element);
        });
      }
    }
    this.loader.load = false;
  }
  async getType(idType: number) {
    return new Promise((res, rej) => {
      let data = {
        pIdEventIn: idType,
      };
      console.log(data);
      this.eventAppService.postPaGetsRequestType(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getTrade(idType: number) {
    return new Promise((res, rej) => {
      let data = {
        eventId: idType,
        officeId: '',
      };
      console.log(data);
      this.officeManagementService.postOfficeAvaluo(data).subscribe({
        next: resp => {
          console.log(resp.data);
          res(resp.data[0]);
        },
        error: eror => {
          this.loader.load = false;
          res(null);
        },
      });
    });
  }
  async getUsers(id: number) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      let data = {
        flagIn: id,
      };
      console.log(data);
      this.generateCveService.postSpUserAppraisal(data, params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getUsersFilter(id: number, user: string) {
    return new Promise((res, rej) => {
      const params = new ListParams();
      let data = {
        flagIn: id,
      };
      params['filter.usuario'] = `$eq:${user}`;
      console.log(data);
      this.generateCveService.postSpUserAppraisal(data, params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp.data[0]);
        },
        error: eror => {
          this.loader.load = false;
          res(null);
        },
      });
    });
  }
  async getCities(params: ListParams, idCyti?: string) {
    return new Promise((res, rej) => {
      if (idCyti) {
        params['filter.idCity'] = idCyti;
      }
      this.cityService.getAllCitys(params).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getFolio(process: number, folio: number) {
    return new Promise((res, rej) => {
      this.usersService.getOffice(process, folio).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async getText(acta: string) {
    return new Promise((res, rej) => {
      this.usersService.getText(acta).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res('');
        },
      });
    });
  }
  async getUserOt(idOficio: number) {
    return new Promise((res, rej) => {
      this.usersService.getUserOt(idOficio.toString()).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(0);
        },
      });
    });
  }
  loadGrid(idType: number, estatus: string) {
    this.loading = true;
    let data = {
      eventId: idType,
      actionJob: estatus,
    };
    this.params.getValue()['filter.sortBy'] = 'keyId: ASC';
    this.findicaService
      .postGetListGood(data, this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp);
          this.data.load(resp.data);
          this.data.refresh();
          this.totalItems = resp.count;
          console.log(resp);
          this.loading = false;
        },
        error: eror => {
          this.loader.load = false;
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
        },
      });
  }
  getUsersList(params: ListParams) {
    let data = {
      flagIn: 1,
    };
    console.log(data);
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        console.log(resp);
        this.sender = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.sender = new DefaultSelect([], 0, true);
      },
    });
  }
  getUsersDesList(params: ListParams) {
    let data = {
      flagIn: 2,
    };
    console.log(data);
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        console.log(resp);
        this.addressee = new DefaultSelect(resp.data, resp.count);
        this.usersList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.addressee = new DefaultSelect([], 0, true);
      },
    });
  }
  getCitiesList(params: ListParams) {
    this.cityService.getAllCitys(params).subscribe({
      next: resp => {
        console.log(resp);
        this.cityList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.cityList = new DefaultSelect([], 0, true);
      },
    });
  }
  onChangeUsers(data: any) {
    this.usuariocopia = {};
    console.log(data);
    this.usuariocopia = data;
  }
  onChangeUsersCopia(data: any) {
    this.usuariocopiaDelete = {};
    console.log(data);
    this.usuariocopiaDelete = data;
  }
  getAddUser() {
    if (this.form.controls['user'].value) {
      this.alertQuestion(
        'question',
        'Agregar Usuario',
        '¿Desea agregar un usuario?'
      ).then(x => {
        if (x.isConfirmed) {
          this.lsbConCopiaList.push(this.usuariocopia);
          console.log(this.lsbConCopiaList);
        }
      });
      // let usuariocopia: string = '';
      // let verificauser: boolean = false;
      // // if (this.lsbConCopiaList.length > 0) {
      //   for (const value of this.lsbConCopiaList) {
      //     console.log(value);
      //     usuariocopia = value.splint('-').toString();
      //     if (usuariocopia == this.form.controls['user'].value) {
      //       verificauser = true;
      //     }
      //   }
      //   if (verificauser != true) {
      //     this.lsbConCopiaList.push(this.form.controls['user'].value);
      //     console.log(this.lsbConCopiaList);
      //   }
      // }
    } else {
      this.alert('warning', 'Debe Seleccionar un Usuario', '');
    }
  }
  getDeleteUser() {
    try {
      this.alertQuestion(
        'question',
        'Eliminar Usuario',
        '¿Desea eliminar un usuario?'
      ).then(x => {
        if (x.isConfirmed) {
          if (this.form.controls['lsbConCopiaCCP'].value != null) {
            let indice = Number(
              String(this.form.controls['lsbConCopiaCCP'].value).charAt(0)
            );
            console.log('Este es el índice: ', indice - 1);
            console.log('Este es el array: ', this.lsbConCopiaList);
            this.lsbConCopiaList.splice(indice - 1, 1);
          } else {
            this.alert('info', 'Selecciona un registro', '');
          }

          const valorFormulario = this.form.controls['lsbConCopiaCCP'].value;

          // Encuentra el índice del elemento que coincide con el valor del formulario
          const indice = this.lsbConCopiaList.indexOf(valorFormulario);

          // Si se encuentra el elemento, elimínalo
          if (indice !== -1) {
            this.lsbConCopiaList.splice(indice, 1);
          } else {
            // Aquí puedes manejar el caso en que el elemento no se encuentra
            console.log('Elemento no encontrado');
          }
        }
      });
      // if (this.form.controls['lsbConCopiaCCP'].value != null) {
      //   let objetoAEliminar = this.usuariocopiaDelete;

      //   // Encontrar la posición del objeto en el arreglo
      //   let index = this.lsbConCopiaList.indexOf(objetoAEliminar);

      //   // Verificar si se encontró el objeto en el arreglo
      //   if (index !== -1) {
      //     this.lsbConCopiaListSelect = new DefaultSelect([], 0, true);
      //     // Eliminar el objeto utilizando splice
      //     this.lsbConCopiaList.splice(index, 1);
      //     this.lsbConCopiaListSelect = new DefaultSelect(
      //       this.lsbConCopiaList,
      //       this.lsbConCopiaList.length
      //     );
      //     this.form.controls['lsbConCopiaCCP'].reset();
      //   }
      //   // if (this.idOficio != null) {
      //   //InsertaUsuConCopia  SP_INSERTAR_CONCOPIA_OFICIO
      //   //eliminar lsbCopia
      //   // } else {
      //   //eliminar lsbCopia
      //   // }
      // }
    } catch (error) {}
  }
  async saveChanges() {
    try {
      this.loader.load = true;
      let type: any = await this.getType(this.event);
      console.log(type);
      this.tipo = type;
      if (this.tipo.direccion == 'I') {
        this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' INMUEBLES';
        this.address = this.tipo.direccion;
      } else if (this.tipo.direccion == 'M') {
        this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' MUEBLES';
        this.address = this.tipo.direccion;
      }
      if (this.form.controls['folio'].value != null) {
        let mComer = await this.getTrade(this.event);
        console.log(mComer);
        if (mComer != null) {
          this.m_comer = mComer;
        }
        console.log(this.m_comer);

        if (this.m_comer.cve_oficio != null) {
          this.m_comer.id_evento = type.id_evento;
          this.m_comer.remitente = this.form.controls['sender'].value;
          this.m_comer.destinatario = this.form.controls['addressee'].value;
          this.m_comer.usuario_insert = this.user;
          this.m_comer.usuario_envia = this.user;
          this.m_comer.ciudad = this.form.controls['city'].value;
          this.m_comer.texto1 = this.form.controls['paragraph1'].value;
          this.m_comer.texto2 = this.form.controls['paragraph2'].value;
          this.m_comer.texto3 = this.form.controls['paragraph3'].value;
          this.m_comer.cve_oficio = this.m_comer.cve_oficio;
          this.m_comer.num_cv_armada = this.form.controls['folio'].value;
          console.log(this.m_comer);
          let rest: any = await this.officeManagement('A', this.m_comer);
          console.log(rest);
          if (rest == true) {
            let mComer: any = await this.getTrade(this.event);
            this.idOficio = mComer.id_oficio;
            this.form.controls['cveService'].setValue(mComer.cve_oficio);
          }
          for (const values of this.lsbConCopiaList) {
            //InsertaUsuConCopia  SP_INSERTAR_CONCOPIA_OFICIO
            console.log(values);
            this.postInsertUsuCopia('I', values, values);
          }
          if (rest) {
            this.alert('success', 'Datos Guardados', '');
            this.loader.load = false;
          } else {
            this.alert('warning', 'No se pudo Guardar los Datos', '');
            this.loader.load = false;
          }
        } else {
          console.log(this.m_comer);
          this.m_comer.id_evento = type.id_evento;
          this.m_comer.remitente = this.form.controls['sender'].value;
          this.m_comer.destinatario = this.form.controls['addressee'].value;
          this.m_comer.usuario_insert = this.user;
          this.m_comer.usuario_envia = this.user;
          this.m_comer.ciudad = this.form.controls['city'].value;
          this.m_comer.texto1 = this.form.controls['paragraph1'].value;
          this.m_comer.texto2 = this.form.controls['paragraph2'].value;
          this.m_comer.texto3 = this.form.controls['paragraph3'].value;
          this.m_comer.cve_oficio =
            this.m_comer.cve_oficio != null ? this.m_comer.cve_oficio : '';
          this.m_comer.num_cv_armada = this.form.controls['folio'].value;
          console.log(this.m_comer);
          let rest: any = await this.officeManagement('R', this.m_comer);
          let mComer: any = await this.getTrade(this.event);
          this.idOficio = mComer.idOficio;
          this.form.controls['cveService'].setValue(mComer.cve_oficio);
          this.num_armada = mComer.num_cv_armada;
          for (const values of this.lsbConCopiaList) {
            //InsertaUsuConCopia  SP_INSERTAR_CONCOPIA_OFICIO
            console.log(values);
            this.postInsertUsuCopia('I', values, values);
          }
          if (rest == true) {
            this.alert('success', 'Datos Guardados', '');
            this.loader.load = false;
          } else {
            this.alert('warning', 'No se pudo Guardar los Datos', '');
            this.loader.load = false;
          }
        }
      }
    } catch (error) {
      this.loader.load = false;
    }
  }
  async sedValuation() {
    try {
      this.loader.load = true;
      let va_evento: number = this.event;
      let type = await this.getType(this.event);
      this.tipo = type;
      if (this.tipo.direccion == 'I') {
        this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' INMUEBLES';
      } else if (this.tipo.direccion == 'M') {
        this.title = 'OFICIO DE ' + this.tipo.tipo_aval + ' MUEBLES';
      }
      if (this.tipo.valor == '2') {
        let mComer = await this.getTrade(this.event);
        console.log(mComer);
        this.m_comer = mComer;
        this.m_comer.id_evento = va_evento;
        this.m_comer.cve_oficio = this.m_comer.cve_oficio;
        this.m_comer.remitente = this.form.controls['sender'].value;
        this.m_comer.destinatario = this.form.controls['addressee'].value;
        this.m_comer.usuario_insert = this.user;
        this.m_comer.usuario_envia = this.user;
        this.m_comer.ciudad = this.form.controls['city'].value;
        this.m_comer.texto1 = this.form.controls['paragraph1'].value;
        this.m_comer.texto2 = this.form.controls['paragraph2'].value;
        this.m_comer.texto3 = this.form.controls['paragraph3'].value;
        this.m_comer.num_cv_armada = this.form.controls['folio'].value;
        let rest: any = await this.officeManagementSed('E', this.m_comer);
        console.log(rest);
        if (rest == true) {
          this.controlControls();
          this.loadGrid(va_evento, 'ENVIADO');
          this.generateReport();
          this.alert('success', 'Informacion Enviada', '');
          this.loader.load = false;
        } else {
          this.alert('warning', 'Datos No Enviados', 'Vuelva a Intentar');
          this.loader.load = false;
        }
      } else {
        this.alert(
          'warning',
          'Es necesario Guardar cambios antes de Enviar los Datos',
          ''
        );
        this.loader.load = false;
      }
    } catch (error) {
      this.loader.load = false;
    }
  }
  generateReport() {
    //no se contruyo un reporte
    let params = {};
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loader.load = false;
      } else {
        this.onLoadToast('warning', 'advertencia', '');
        this.loader.load = false;
      }
    });
  }
  seeJob() {
    this.loader.load = true;
    this.generateReport();
  }
  async officeManagement(acction: string, mComer: any) {
    return new Promise((res, rej) => {
      let data = {
        actionIn: acction,
        idJobIn: mComer.id_oficio != null ? mComer.id_oficio : 0,
        idEventIn: mComer.id_evento,
        jobKeyIn: mComer.cve_oficio,
        userInsertIn: mComer.usuario_insert,
        userSendIn: mComer.usuario_envia,
        idJobReferenceIn:
          mComer.id_oficio_referencia != null ? mComer.id_oficio_referencia : 0,
        senderIn: mComer.remitente,
        addresseeIn: mComer.destinatario,
        cityIn: mComer.ciudad,
        text1In: mComer.texto1,
        text2In: mComer.texto2,
        text3In: mComer.texto3,
        navyNumberKeyIn: mComer.num_cv_armada,
      };
      console.log(data);
      this.appraisesService.getPaTriggerOAppraise(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async officeManagementSed(acction: string, mComer: any) {
    return new Promise((res, rej) => {
      let data = {
        actionIn: acction,
        idJobIn: mComer.id_oficio,
        idEventIn: mComer.id_evento,
        jobKeyIn: mComer.cve_oficio,
        userInsertIn: mComer.usuario_insert,
        userSendIn: mComer.usuario_envia,
        idJobReferenceIn:
          mComer.id_oficio_referencia != null ? mComer.id_oficio_referencia : 0,
        senderIn: mComer.remitente,
        addresseeIn: mComer.destinatario,
        cityIn: mComer.ciudad,
        text1In: mComer.texto1,
        text2In: mComer.texto2,
        text3In: mComer.texto3,
        navyNumberKeyIn: mComer.num_cv_armada,
      };
      console.log(data);
      this.appraisesService.getPaTriggerOAppraise(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
    });
  }
  async postInsertUsuCopia(acction: string, mComer: any, value: any) {
    return new Promise(async (res, rej) => {
      console.log(mComer);
      let data = {
        user: mComer.usuario,
        jobId: mComer.id_oficio,
        action: acction,
        userType: 'INTERNO',
      };

      this.usersService.postSpInsertWithcopyOfficia(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
      // res(0);
    });
  }
  obtenerTextoDespuesDelGuion(texto): string {
    const partes = texto.split('-'); // Dividir el string en partes utilizando el guion como separador
    return partes.length > 1 ? partes[1].trim() : ''; // Seleccionar la segunda parte y eliminar espacios en blanco al principio y al final
  }
  async postInsertUsuConCopia(acction: string) {
    return new Promise((res, rej) => {
      // this.usersService.getUserOt(acction).subscribe({
      //   next: resp => {
      //     console.log(resp);
      //     res(resp);
      //   },
      //   error: eror => {
      //     this.loader.load = false;
      //     res(eror);
      //   },
      // });
      res(0);
    });
  }
  controlControls() {
    this.addUser = true;
    this.removeUser = true;
    this.form.controls['txtUserCCP'].disable();
    this.form.controls['user'].disable();
    this.searchChanges = true;
    this.sendFi = true;
    this.viewOf = false;
    this.form.controls['sender'].disable();
    this.form.controls['folio'].disable();
    this.form.controls['addressee'].disable();
    this.form.controls['city'].disable();
    this.form.controls['paragraph1'].disable();
    this.form.controls['paragraph2'].disable();
    this.form.controls['paragraph3'].disable();
  }
  loadControls() {
    console.log(this.m_comer);
    this.form.controls['cveService'].setValue(this.m_comer.cve_oficio);
    this.form.controls['sender'].setValue(this.m_comer.remitente);
    this.form.controls['addressee'].setValue(this.m_comer.destinatario);
    this.form.controls['paragraph1'].setValue(this.m_comer.texto1);
    this.form.controls['paragraph2'].setValue(this.m_comer.texto2);
    this.form.controls['paragraph3'].setValue(this.m_comer.texto3);
    this.form.controls['folio'].setValue(this.m_comer.num_cv_armada);
  }
  clear() {
    this.form.reset();
  }
  close() {
    this.router.navigateByUrl('pages/commercialization/event-preparation');
    return;
  }
}
