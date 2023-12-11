import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPupCompFolioUniv } from 'src/app/core/models/catalogs/package.model';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMLNS_CC, COLUMLNS_DIST } from '../columns';

interface trec_DIST {
  DELEGACION: number;
  DESCRIPCION: string;
  NO_REG: number;
  CANTIDAD: number;
}

interface trec {
  DELEGACION?: number;
  PARA: string;
}

interface Blk {
  descripcion: string;
  email: string;
  no_delegacion: number;
  nombre: string;
  usuario: string;
  procesar: string;
}

@Component({
  selector: 'app-modal-correo',
  templateUrl: './modal-correo.component.html',
  styles: [],
})
export class ModalCorreoComponent extends BasePage implements OnInit {
  totalItemsCc: number = 0;
  paramsCc = new BehaviorSubject<ListParams>(new ListParams());
  dataCc: LocalDataSource = new LocalDataSource();
  columnFiltersCc: any = [];
  loadingCc: boolean = this.loading;
  settingsCc = this.settings;

  totalItemsDist: number = 0;
  paramsDist = new BehaviorSubject<ListParams>(new ListParams());
  dataDist: LocalDataSource = new LocalDataSource();
  columnFiltersDist: any = [];
  loadingDist: boolean = this.loading;
  settingsDist = this.settings;

  form: FormGroup = new FormGroup({});
  acta: IProceedingDeliveryReception;
  detalleActa: any[];
  mensaje: string;
  title: string = 'Oficios de Autorización de Destrucción';

  proceeding: string = null;
  expedient: string = null;
  universalFolio: string = null;
  proceedingKey: string = null;
  elaborationDate: any = null;

  get user() {
    return this.authService.decodeToken();
  }

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private serviceDocuments: DocumentsService,
    private authService: AuthService,
    private userService: UsersService,
    private parametergoodService: ParameterCatService,
    private serviceMassiveGoods: MassiveGoodService,
    private serviceUser: UsersService,
    private goodprocesServices: GoodProcessService
  ) {
    super();

    this.settingsDist = {
      ...this.settings,
      hideSubHeader: false,
      columns: { ...COLUMLNS_DIST },
    };

    this.settingsCc = {
      ...this.settings,
      hideSubHeader: false,
      columns: { ...COLUMLNS_CC },
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      mensaje: [null],
    });
    this.pupLlenaDist();
  }

  async pupLlenaDist() {
    ////// AQUI LO DE LO QUE EDUARDO ME VA A ENTREGAR
    await this.consultationQuery1();
    await this.consultationQuery2();
    ////
    this.pupInicializaCorreo('C');
  }

  consultationQuery1() {
    return new Promise((res, _rej) => {
      this.loadingDist = true;
      this.userService
        .consultationQuery1(this.proceeding, this.paramsDist.getValue())
        .subscribe({
          next: resp => {
            this.dataDist.load(resp.data);
            this.dataDist.refresh();
            this.totalItemsDist = resp.count;
            this.loadingDist = false;
            res(true);
          },
          error: err => {
            this.dataDist.load([]);
            this.dataDist.refresh();
            this.totalItemsDist = 0;
            this.loadingDist = false;
            res(false);
          },
        });
    });
  }

  consultationQuery2() {
    return new Promise((res, _rej) => {
      this.loadingCc = true;
      this.userService
        .consultationQuery2(this.paramsDist.getValue())
        .subscribe({
          next: resp => {
            this.dataCc.load(resp.data);
            this.dataCc.refresh();
            this.totalItemsCc = resp.count;
            this.loadingCc = false;
            res(true);
          },
          error: err => {
            this.dataCc.load([]);
            this.dataCc.refresh();
            this.totalItemsCc = 0;
            this.loadingCc = false;
            res(false);
          },
        });
    });
  }

  async pupInicializaCorreo(pAccion: string) {
    let n_REG = 0;
    let n_CONT = 0;
    const tab_DIST: trec_DIST[] = [];
    const blkDist: Blk[] = await this.dataDist.getAll();

    blkDist.forEach(element => {
      for (let n_I = 1; n_I <= n_CONT; n_I++) {
        if (tab_DIST[n_I].DELEGACION === element.no_delegacion) {
          n_REG = n_I;
          break;
        }
      }
      if (n_REG === 0) {
        n_CONT++;
        tab_DIST[n_CONT] = {
          DELEGACION: element.no_delegacion,
          DESCRIPCION: element.descripcion,
          NO_REG: 0,
          CANTIDAD: 0,
        };
      }
    });

    if (n_CONT > 0) {
      let c_MENSAJE1: string = 'Estimados:\n\n';
      if (pAccion === 'C') {
        c_MENSAJE1 += `Se les notifica que con esta fecha, ${this.detalleActa.length} registros considerados en el oficio de autorización de `;
        c_MENSAJE1 += `destrucción número ${this.proceedingKey} cambiaron de estatus a AXD (Bien Autorizado `;
        c_MENSAJE1 +=
          'para Destrucción), los cuales puede identificar en el SIAB.';
      } else {
        c_MENSAJE1 += `Por medio del presente, se les hace de su conocimiento que en base al Oficio de Autorización ${
          this.proceedingKey
        } con Fecha ${this.elaborationDate.toLocaleDateString(
          'es-MX'
        )}, las cantidades de bienes relacionados a continuación, fueron cambiados a su estatus anterior de AXD.`;
      }
      c_MENSAJE1 += '\n\nSaludos cordiales.';
      this.form.get('mensaje').setValue(c_MENSAJE1);
    }
  }

  async continue() {
    const responde = await this.alertQuestion(
      'question',
      'Esta seguro que desea cerrar el Oficio',
      '¿Desea Continuar Con el Proceso?'
    );
    if (responde.isConfirmed) {
      await this.pupCompFolUniv();
    }
  }

  async dataUser() {
    return new Promise((resolve, _rej) => {
      const token = this.authService.decodeToken();
      const routeUser = `?filter.id=$eq:${token.preferred_username}`;
      this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
        console.log(res);
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        resolve({
          delegation: resJson.usuario.delegationNumber,
          subDelegation: resJson.usuario.subdelegationNumber,
          departament: resJson.usuario.departamentNumber,
        });
      });
    });
  }

  async pupCompFolUniv() {
    const dataUser = await this.dataUser();
    console.log(dataUser);
    const dataJson = JSON.parse(JSON.stringify(dataUser));

    const body: IPupCompFolioUniv = {
      proceeding: parseInt(this.proceeding),
      expedient: parseInt(this.expedient),
      universalFolio: this.universalFolio,
      proceedingKey: this.proceedingKey,
      user: this.user.preferred_username,
      delegation: dataJson.delegation,
      subDelegation: dataJson.subDelegation,
      departament: dataJson.departament,
    };
    console.log(body);
    console.log(this.user);

    this.serviceMassiveGoods.pupCompFolioUniv(body).subscribe(
      res => {
        console.log(res);
        this.pupEnvioCorreo('C');
        this.alert(
          'success',
          this.title,
          'El Oficio Ha Sido Cerrado Correctamente.'
        );
        this.closed();
      },
      err => {
        console.log(err);
        this.alert('error', 'Se presentó un error al cerrar el acta', '');
      }
    );
  }

  expedients(pc_NO_ACTA: string | number, pc_NO_EXPEDIENTE: string | number) {
    return new Promise<any[]>((res, rej) => {
      const model = {
        actaNo: pc_NO_ACTA,
        expNo: pc_NO_EXPEDIENTE,
      };
      this.goodprocesServices.getExpedients(model).subscribe({
        next: resp => {
          res(resp.data);
        },
        error: err => {
          res([]);
        },
      });
    });
  }

  async pupEnvioCorreo(p_ACCION: string) {
    let n_REG = 0;
    let n_CONT = 0;
    const tab_DIST: trec[] = [];
    const dataDist: Blk[] = await this.dataDist.getAll();
    dataDist.forEach(element => {
      if (element.usuario !== null) {
        if (element.procesar === 'S') {
          for (let n_I = 1; n_I <= n_CONT; n_I++) {
            if (tab_DIST[n_I].DELEGACION === element.no_delegacion) {
              n_REG = n_I;
              break;
            }
          }
          if (n_REG === 0) {
            n_CONT++;
            tab_DIST[n_CONT] = {
              DELEGACION: element.no_delegacion,
              PARA: element.email,
            };
          } else {
            tab_DIST[n_CONT] = {
              PARA: element.email,
            };
          }
        }
      }
    });
    if (n_CONT > 0) {
      let c_COPIA: string = null;
      const dataCc: Blk[] = await this.dataCc.getAll();
      dataCc.forEach(element => {
        if (element.email !== null) {
          if (element.procesar === 'S') {
            if (c_COPIA === null) {
              c_COPIA = element.email;
            } else {
              c_COPIA += `,${element.email}`;
            }
          }
        }
      });
      let c_ASUNTO: string = null;
      if (p_ACCION === 'C') {
        c_ASUNTO = 'Cambio de Estatus de Bienes a AXD.';
      } else {
        c_ASUNTO = 'Cambio de Estatus de Bienes de AXD al Estatus anterior.';
      }
      for (let n_I = 1; n_I <= n_CONT; n_I++) {
        ///////  ////////
        this.paEnvioCorreoGenerico(
          'infosaedwh@sae.gob.mx',
          tab_DIST[n_I].PARA,
          c_COPIA,
          c_ASUNTO,
          this.form.get('mensaje').value
        );
        ///////////////
      }
    }
  }

  paEnvioCorreoGenerico(
    correo: string,
    para: string,
    copia: string,
    asunto: string,
    mensaje: string
  ) {
    return new Promise((res, rej) => {
      const model: any = {
        p_sender: correo,
        p_recipients: para,
        p_cc: copia,
        p_bcc: null,
        p_subject: asunto,
        p_message: mensaje,
        p_resul: '',
      };

      this.parametergoodService.paEnvioCorreoGenerico(model).subscribe({
        next: (resp: any) => {
          this.alert('success', this.title, resp.data);
        },
        error: err => {
          this.alert('error', this.title, err.error.message);
        },
      });
    });
  }

  closed() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
