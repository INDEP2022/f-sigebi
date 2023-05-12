import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { TmpManagementProcedureService } from 'src/app/core/services/ms-procedure-management/tmp-management-procedure.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-turn-paperwork',
  templateUrl: './turn-paperwork.component.html',
  styles: [],
})
export class TurnPaperworkComponent extends BasePage implements OnInit {
  paperworks: any = null;
  paperwork: any = null;
  form = this.fb.group({
    user: new FormControl<string>(null, Validators.required),
  });
  user: any = null;
  users = new DefaultSelect();
  loadingText = 'Cargando ...';
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalRef: BsModalRef,
    private tmpManagementProcedureService: TmpManagementProcedureService,
    private jwtHelper: JwtHelperService,
    private procedureManagementService: ProcedureManagementService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.paperwork = this.paperworks[0];
  }

  getUsers(params: ListParams) {
    this.usersService.getAllSegUsers(params).subscribe({
      next: response =>
        (this.users = new DefaultSelect(response.data, response.count)),
      error: error => {
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al obtener los usuarios'
          );
        }
      },
    });
  }

  onUserChange(user: any) {
    if (!user) {
      this.user = null;
    } else {
      this.user = user;
    }
  }

  close() {
    this.modalRef.content.callback();
    this.modalRef.hide();
  }

  async confirm() {
    if (!this.form.valid) {
      this.onLoadToast('error', 'Error', 'El formulario es inválido');
      this.form.markAllAsTouched();
      return;
    }
    const id = this.form.controls.user.value;
    const { name } = this.user;
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      `¿Desea turnar los trámites seleccionados al usuario: ${name}?`
    );
    if (result.isConfirmed) {
      await this.askForFolio();
    }
  }

  async askForFolio() {
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      '¿Desea generar folio de recepción a los trámites seleccionados?'
    );
    if (result.isConfirmed) {
      this.generateReceptionFolio('S');
    } else {
      this.generateReceptionFolio('N');
    }
  }

  generateReceptionFolio(response: string) {
    const token = this.jwtHelper.decodeToken();
    const user = this.paperwork.turnadoiUser;
    const observations = this.paperwork.observation;
    const userTurn = this.form.controls.user.value;
    const body = {
      userTurn,
      user,
      observations,
      response,
    };
    this.loading = true;
    this.loadingText = 'Cargando ...';
    this.turnPaperWork(body).subscribe(() => {
      if (this.paperwork?.processStatus != 'OPI') {
        this.loading = false;
        this.alertQuestion(
          'info',
          'Aviso',
          'El usuario se turnó correctamente. El reporte solo está disponible para los trámites con estatus "OPI"'
        );
        return;
      }
      this.loadingText = 'Generando reporte ...';
      this.downloadReport(userTurn).subscribe({
        next: res => (this.loading = false),
        error: error => (this.loading = false),
      });
    });
  }

  downloadReport(user: string) {
    return this.getPaperwork().pipe(
      switchMap(paperwork => {
        const params = {
          PFOLIO: paperwork.folio,
          PTURNADOA: user,
        };
        return this.siabService.fetchReport('RFOL_DOCTOSRECIB_SATSAE', params);
      }),
      tap(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        console.log({ blob: blob, url: url });
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
      })
    );
  }

  getPaperwork() {
    console.log(this.paperwork.processNumber);
    return this.procedureManagementService.getById(
      this.paperwork.processNumber
    );
  }

  turnPaperWork(body: {}) {
    return this.tmpManagementProcedureService.folioReception(body).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrió un error al turnar el trámite');
        return throwError(() => error);
      }),
      tap(() => {
        this.onLoadToast('success', 'El trámite se turnó correctamente', '');
        this.modalRef.content.callback(true);
        this.close();
      })
    );
  }
}
