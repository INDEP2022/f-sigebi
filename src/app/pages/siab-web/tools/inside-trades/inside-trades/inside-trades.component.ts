import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OutsideTradesService } from 'src/app/core/services/catalogs/outside-trades.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-inside-trades',
  templateUrl: './inside-trades.component.html',
  styles: [],
})
export class InsideTradesComponent extends BasePage implements OnInit {
  constructor(
    private authService: AuthService,
    private siabService: SiabService,
    private activatedRoute: ActivatedRoute,
    private outsideTradesService: OutsideTradesService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private router: Router
  ) {
    super();
  }
  user: string;
  form: FormGroup;
  principal: any = [];
  maxDate = new Date();
  No_gestion: number = 0;
  noOFGestion: number;
  val_no_ges: number;
  sessionInvalid: Boolean;
  noGes: number;
  valid1: boolean;

  ngOnInit(): void {
    this.createForm();
    this.getData();
  }
  createForm() {
    this.form = new FormGroup({
      cve_of_gestion: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      fecha: new FormControl(''),
      nombre: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      ciudad: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      texto1: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      texto2: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      NoVolante: new FormControl(''),
      NoExpediente: new FormControl(''),
      avePre: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      notv: new FormControl(''),
      nombre2: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      OTVALOR1: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      cpp: new FormControl(''),
    });
  }
  async getData() {
    if (this.authService.decodeToken().azp === 'indep-auth') {
      /*this.activatedRoute.queryParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(params => {
          this.val_no_ges = Number(params['NoGestion'])
            ? String(params['NoGestion'])
            : null;
        });*/
      if (this.noGes) {
        this.val_no_ges = this.noGes;
      } else {
        this.val_no_ges = null;
      }

      if (this.val_no_ges == null) {
        //
        //
        this.router.navigate([`/pages/siab-web/tools/property`]);
        //
        //
      } else {
        /*this.No_gestion = JSON.parse(this.val_no_ges);
        this.noOFGestion = JSON.parse(this.val_no_ges);*/

        this.principal = await this.getBasicBody(this.val_no_ges);

        this.form.controls['cve_of_gestion'].setValue(
          this.principal.cve_of_gestion
        );
        this.form.controls['fecha'].setValue(this.principal.fecha);
        this.form.controls['nombre'].setValue(this.principal.nombre);
        this.form.value.ciudad = 'ADMINISTRACION';
        this.form.controls['texto1'].setValue(this.principal.texto1);
        this.form.controls['texto2'].setValue(this.principal.texto2);
        this.form.controls['NoVolante'].setValue(this.principal.no_volante);
        this.form.controls['NoExpediente'].setValue(
          this.principal.no_expediente
        );
        this.form.controls['avePre'].setValue(
          await this.getPreliminaryInvestigation(this.noOFGestion)
        );
        this.form.controls['notv'].setValue(
          await this.getNameOTValue(this.noOFGestion)
        );
        this.form.controls['nombre2'].setValue(this.form.value.notv.nombre);
        this.form.controls['OTVALOR1'].setValue(this.form.value.notv.otvalor);
        this.form.controls['cpp'].setValue(await this.getCPP(this.noOFGestion));
      }
      localStorage.setItem('Violation', 'false');
    } else {
      localStorage.setItem('Violation', 'true');

      this.router.navigate([`/pages/siab-web/tools/property`]);

      localStorage.clear();
    }
  }
  async getBasicBody(id: number) {
    return new Promise((resolve, reject) => {
      this.outsideTradesService.getBasicBody(id).subscribe({
        next: data => {
          resolve(data.data[0]);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async getPreliminaryInvestigation(id: number) {
    return new Promise((resolve, reject) => {
      this.outsideTradesService.getPreliminaryInvestigation(id).subscribe({
        next: data => {
          resolve(data.data[0].averiguacion_previa);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async getNameOTValue(id: number) {
    return new Promise((resolve, reject) => {
      this.outsideTradesService.getNameOTValue(1538).subscribe({
        next: data => {
          resolve(data.data[0]);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async getCPP(id: number) {
    return new Promise((resolve, reject) => {
      this.outsideTradesService.getCPP(id).subscribe({
        next: data => {
          let message = `tipo:${data.data[0].tipo}, cpp:${data.data[0].cpp}`;
          resolve(message);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async onClickPrintOffice() {
    let report = 'Oficios_Externos.aspx';
    let cve_of_gestion = this.form.value.cve_of_gestion;
    let fecha = this.form.value.fecha;
    let nombre = this.form.value.nombre;
    let ciudad = this.form.value.ciudad;
    let texto1 = this.form.value.texto1;
    let texto2 = this.form.value.texto2;
    let NoVolante = this.form.value.NoVolante;
    let NoExpediente = this.form.value.NoExpediente;
    let avePres = this.form.value.avePres;
    let notv = this.form.value.notv;
    let nombre2 = this.form.value.nombre2;
    let OTVALOR1 = this.form.value.OTVALOR1;
    let cpp = this.form.value.cpp;
    this.printReport(report, {
      cve_of_gestion,
      fecha,
      nombre,
      ciudad,
      texto1,
      texto2,
      NoVolante,
      NoExpediente,
      avePres,
      notv,
      nombre2,
      OTVALOR1,
      cpp,
    });
  }

  printReport(report: string, params: any) {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
        //  console.log('habemus pdf');
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
      error: () => {
        this.loading = false;
        this.onLoadToast('error', '', 'Reporte No Disponible');
      },
    });
  }
  goBack() {
    window.history.back();
  }
}
