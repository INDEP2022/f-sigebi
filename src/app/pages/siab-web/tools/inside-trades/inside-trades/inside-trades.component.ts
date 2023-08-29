import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
    private activatedRoute: ActivatedRoute,
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
  val_no_ges: string;
  sessionInvalid: Boolean;

  ngOnInit(): void {
    this.createForm();
    this.getData();
    if (this.authService.decodeToken().azp === 'indep-auth') {
      this.activatedRoute.queryParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(params => {
          this.val_no_ges = params['NoGestion']
            ? String(params['NoGestion'])
            : null;
        });
      if (this.val_no_ges == null || this.val_no_ges == '') {
        //
        //
        //this.router.navigate([`/pages/home`]);
        //
        //
      } else {
        this.No_gestion = JSON.parse(this.val_no_ges);
        this.noOFGestion = JSON.parse(this.val_no_ges);
        // implementa el endpoint  filtro.tipo_oficio(noOFGestion);
        let metodo: number;
        this.principal = new Array();

        this.form.controls['cve_of_gestion'] = this.principal[0];
        this.form.controls['fecha'] = this.principal[1];
        this.form.controls['nombre'] = this.principal[3];
        this.form.value.ciudad = 'ADMINISTRACION';
        this.form.controls['texto1'] = this.principal[4];
        this.form.controls['texto2'] = this.principal[5];
        this.form.controls['NoVolante'] = this.principal[11];
        this.form.controls['NoExpediente'] = this.principal[12];
        //metodos para obtener la data de los siguientes 2 paramentros
        this.form.controls['avePre'] = this.principal[metodo];
        //metodos para obtener la data del siguiente paramentro
        /**/ this.form.controls['notv'] = this.principal[metodo];
        this.form.controls['nombre2'] = this.form.value.notv[0];
        this.form.controls['OTVALOR1'] = this.form.value.notv[1];
        //metodos para obtener la data del siguiente paramentro
        this.form.controls['cpp'] = this.principal[metodo];
      }
      this.sessionInvalid = false;
    } else {
      this.sessionInvalid = true;
      this.onLoadToast('success', 'ay caramba', 'Actualizado Correctamente');
      //this.router.navigate([`/pages/home`]);
      localStorage.clear();
    }
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
  getData() {
    console.log(this.authService.decodeToken().azp);
    console.log(this.authService.decodeToken());
    this.user = this.authService
      .decodeToken()
      .preferred_username?.toUpperCase();
  }
}
