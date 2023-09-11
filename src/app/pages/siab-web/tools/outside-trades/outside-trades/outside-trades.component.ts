import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OutsideTradesService } from 'src/app/core/services/catalogs/outside-trades.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-outside-trades',
  templateUrl: './outside-trades.component.html',
  styles: [],
})
export class OutsideTradesComponent extends BasePage implements OnInit {
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private outsideTradesService: OutsideTradesService
  ) {
    super();
  }
  principal: any = [];
  tip: any = [];
  form: FormGroup;
  No_gestion: number = 0;
  val_no_ges: string;
  tipos_oficio: string;
  user: string;
  a: string;
  access: boolean;
  noOFGestion: number;
  sessionInvalid: Boolean;
  maxDate = new Date();

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
      /**/ notv: new FormControl(''),
      nombre2: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      OTVALOR1: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      cpp: new FormControl(''),
    });
  }
  async getData() {
    console.log(this.authService.decodeToken());
    //verificar si la autenticacion es correcta
    if (this.authService.decodeToken().azp === 'indep-auth') {
      this.activatedRoute.queryParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(params => {
          this.val_no_ges = params['NoGestion']
            ? String(params['NoGestion'])
            : null;
        });

      // this.a = localStorage.getItem("VEROFICIOS"); // no se en el Token que exactamente seria el veroficios--- this.authService.decodeToken().exp
      this.a = 'XD'; // no se en el Token que exactamente seria el veroficios--- this.authService.decodeToken().exp
      this.val_no_ges = '404562';
      console.log('this.a', this.a);
      try {
        if (this.val_no_ges == null || this.val_no_ges == '') {
          if (this.a === 'SIABWEB') {
            //
            //
            this.router.navigate([`/auth/login`]);
            //this.router.navigate([`/pages/home`]);
            //
            //
          }
          if (this.a === 'SAT-SAE') {
            //
            //
            this.router.navigate([`/auth/login`]);
            //this.router.navigate([`/pages/home`]);
            //
            //
          }
          if (this.a === 'PGR') {
            //
            //
            //
            //
          }
          this.alert(
            'warning',
            'Advertencia',
            'Lo Sentimos no se ha Encontrado el Número de Gestion'
          );
        } else {
          this.sessionInvalid = true;
          this.No_gestion = JSON.parse(this.val_no_ges);
          this.noOFGestion = JSON.parse(this.val_no_ges);
          this.tip = await this.getTipoOficio(this.noOFGestion);
          this.tipos_oficio = this.tip;
          console.log(this.tipos_oficio);

          if (this.tipos_oficio == 'EXTERNO') {
            this.principal = await this.getBasicBody(this.noOFGestion);
            console.log(this.principal);

            this.form.controls['cve_of_gestion'].setValue(
              this.principal.cve_of_gestion
            );
            this.form.controls['fecha'].setValue(this.principal.fecha);
            this.form.controls['nombre'].setValue(this.principal.nombre);
            this.form.controls['ciudad'].setValue(this.principal.ciudad);
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
            this.form.controls['OTVALOR1'].setValue(
              this.form.value.notv.otvalor
            );
            this.form.controls['cpp'].setValue(
              await this.getCPP(this.noOFGestion)
            );
            console.log(this.form.value);
          }
          if (this.a === 'SIABWEB') {
            //
            //
            //
            //
          }
          if (this.a === 'SAT-SAE') {
            //
            //
            localStorage.setItem('ficha', 'sificha');
            console.log('aqui');
            //this.router.navigate([`/auth/login`]);
            //this.router.navigate([`/pages/home`]);
            //
            //
          }
          if (this.a === 'PGR') {
            //
            //
            //
            //
          }
          if (this.tipos_oficio == 'INTERNO') {
            //
            //
            console.log('aqui');
            // this.router.navigate([`/auth/login`]);
            //this.router.navigate([`/pages/home`]);
            //
            //
          }
        }
      } catch (e) {
        //
        //
        localStorage.setItem('Violation', 'false');
        console.log('aqui');
        this.onLoadToast(
          'warning',
          'Advertencia',
          'Lo Sentimos no se ha Obtenido Toda la Información'
        );
        //this.router.navigate([`/auth/login`]);
        //this.router.navigate([`/pages/home`]);
        //
        //
      }
    } else {
      this.sessionInvalid = true;
      //this.onLoadToast('success', 'ay caramba', 'Actualizado Correctamente');
      console.log('aqui');
      //this.router.navigate([`/auth/login`]);
      localStorage.clear();
    }
  }

  async getTipoOficio(id: number) {
    return new Promise((resolve, reject) => {
      this.outsideTradesService.getTipoOficio(id).subscribe({
        next: data => {
          resolve(data.data[0].jobType);
        },
      });
    });
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
          console.log(data.data[0].averiguacion_previa);
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
      ////////////////////////////////////////////////////
      this.outsideTradesService.getNameOTValue(1538).subscribe({
        next: data => {
          console.log(data.data[0]);
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
          console.log(message);
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
