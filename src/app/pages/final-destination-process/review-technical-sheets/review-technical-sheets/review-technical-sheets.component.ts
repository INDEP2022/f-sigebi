import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-review-technical-sheets',
  templateUrl: './review-technical-sheets.component.html',
  styles: [],
})
export class ReviewTechnicalSheetsComponent extends BasePage implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  selectReview: any = [];
  technicalSheets: any[] = [];
  totCumplidos: number = 0;
  totNoCumplidos: number = 0;
  totCumplimiento: number = 0;
  totRegistros: number = 0;
  DWHERE: string;
  BLK_PARAM: any;
  myService: any;

  get initDate() {
    return this.form.get('initDate');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private servideUpdate: DetailProceeDelRecService,
    private indicatorService: GoodsQueryService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = { ...this.settings, actions: false, hideSubHeader: false };
    this.settings.columns = COLUMNS;
  }

  private parseDate(dateString: string | null): string | null {
    // Verifica si dateString es "null" y devuelve null si es así
    if (dateString === 'null') {
      return null;
    }
    // Procede a analizar la fecha si no es "null"
    const date = dateString ? new Date(dateString) : null;
    return date ? date.toISOString().substring(0, 10) : null;
  }

  private parseValue(value: string | null): string | null {
    if (value === 'null') {
      return null;
    }
    return value;
  }
  private isValidDate(dateString: string | null): boolean {
    // Verifica si dateString es "null" o si es una fecha válida
    return dateString !== 'null' && !isNaN(Date.parse(dateString));
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      console.log(params);

      const startDate = params.get('fechaInicial');
      const endDate = params.get('fechaFinal');
      const username = params.get('usuarioRevision');
      const noDelegacion = +params.get('noDelegacion'); // Convierte a número si es necesario

      // Asigna los valores obtenidos a los campos en el formulario
      const currentInitDate = this.form.get('initDate').value;
      const currentEndDate = this.form.get('endDate').value;
      const currentUserUploadAct = this.form.get('userUploadAct').value;

      // Asigna los valores de los parámetros solo si no son "null"
      this.form
        .get('initDate')
        .setValue(startDate !== 'null' ? startDate : currentInitDate);
      this.form
        .get('endDate')
        .setValue(endDate !== 'null' ? endDate : currentEndDate);
      this.form
        .get('userUploadAct')
        .setValue(username !== 'null' ? username : currentUserUploadAct);

      // Convierte a número solo si noDelegacion no es nulo o indefinido
      if (!isNaN(noDelegacion)) {
        this.form.get('regCoordination').setValue(noDelegacion);
      }
    }),
      (this.totalItems = 0);
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            //console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe));
    this.getData();
  }

  initForm() {
    this.form = this.fb.group({
      initDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      proceedingsSiab: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      initAct: [null, [Validators.required]],
      endAct: [null, [Validators.required]],
      userUploadAct: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      regCoordination: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      transf: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      issuing: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      authority: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  onSubmit() {}

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };
    this.indicatorService.getIndicatorsEntRecep(params).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.data.load(response.data);
        console.log(response);
        console.log(this.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  save() {
    this.loading = true;

    const fechaInicio = this.form.get('initDate').value;
    const fechaFin = this.form.get('endDate').value;

    const ActaInicio = this.form.get('initAct').value;
    const ActaFin = this.form.get('endAct').value;

    const fechaInicioFormateada = this.datePipe.transform(
      fechaInicio,
      'dd-MM-yyyy'
    );
    const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    const fechaActaInicio = this.datePipe.transform(ActaInicio, 'dd-MM-yyyy');
    const fechaActaFin = this.datePipe.transform(ActaFin, 'dd-MM-yyyy');

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (fechaInicioFormateada !== null)
      params['filter.fechaInicioFormateada'] = `$eq:${fechaInicioFormateada}`;

    if (fechaFinFormateada !== null)
      params['filter.fechaFinFormateada'] = `$eq:${fechaFinFormateada}`;

    if (this.form.get('proceedingsSiab').value !== null)
      params['filter.proceedingsSiab'] = `$eq:${
        this.form.get('proceedingsSiab').value
      }`;

    if (fechaActaInicio !== null)
      params['filter.fechaActaInicio'] = `$eq:${fechaActaInicio}`;

    if (fechaActaFin !== null)
      params['filter.fechaActaFin'] = `$eq:${fechaActaFin}`;

    if (this.form.get('userUploadAct').value !== null)
      params['filter.userUploadAct'] = `$eq:${
        this.form.get('userUploadAct').value
      }`;

    if (this.form.get('regCoordination').value !== null)
      params['filter.regCoordination'] = `$eq:${
        this.form.get('regCoordination').value
      }`;

    if (this.form.get('transf').value !== null)
      params['filter.transf'] = `$eq:${this.form.get('transf').value}`;

    if (this.form.get('issuing').value !== null)
      params['filter.issuing'] = `$eq:${this.form.get('issuing').value}`;

    if (this.form.get('authority').value !== null)
      params['filter.authority'] = `$eq:${this.form.get('authority').value}`;

    console.log(params);
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  report() {
    //FESTCOTPRE_0001
    let params = {
      //PN_DEVOLUCION: this.data,
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
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

  selectData(event: { data: any; selected: any }) {
    console.log('AQUI', event);
    this.selectReview = event.data; // Asegúrate de que selectReview sea un objeto, no un array
    console.log('this.selectReview', this.selectReview);
  }

  pup_refresca() {
    if (!this.selectReview) {
      return; // Salir si no hay una selección válida
    }

    let lv_revisa: number;
    let lv_correcto: number;

    if (this.selectReview.reviewIndft === 2) {
      lv_revisa = 0;
    } else {
      lv_revisa = 1;
    }

    if (this.selectReview.correctIdft === 2) {
      lv_correcto = 0;
    } else {
      lv_correcto = 1;
    }

    if (lv_revisa !== 0 || lv_correcto !== 0) {
      if (this.selectReview.user === 'USRPRU') {
        const updateParams = {
          reviewIndft: this.selectReview.reviewIndft,
          correctIndft: this.selectReview.correctIdft,
          numberGood: this.selectReview.assetNumber,
          numberProceedings: this.selectReview.recordNumber,
        };

        console.log(updateParams);

        /*this.servideUpdate.updateGoodsByProceedings(updateParams).subscribe({
          next: data => {
            this.handleSuccess();
            console.log('Actualización exitosa:', data);
          },
          error: error => {
            this.loading = false;
            console.error('Error al actualizar:', error);
          },
        });

        console.log(this.selectReview.user);
      } else {
        const updateParams1 = {
          reviewIndft: this.selectReview.reviewIndft,
          correctIndft: this.selectReview.correctIdft,
          numberGood: this.selectReview.assetNumber,
          numberProceedings: this.selectReview.recordNumber,
          idftUser: this.selectReview.user,
          idftDate: new Date(),
          numDelegationIndft: this.selectReview.delegationNumberIdft,
        };

        console.log(updateParams1);

        this.servideUpdate.updateGoodsByProceedings(updateParams1).subscribe({
          next: data => {
            this.handleSuccess();
            console.log('Actualización exitosa:', data);
          },
          error: error => {
            this.loading = false;
            console.error('Error al actualizar:', error);
          },
        });
*/
        console.log(this.selectReview.user);
      }
    }
  }

  clean() {
    this.form.reset();

    this.totalItems = 0;
    this.data.load([]);
    this.data.refresh();

    this.router.navigate(['pages/final-destination-process/technical-sheets']);
  }

  calculateTotals(): void {
    this.totCumplidos = 0;
    this.totNoCumplidos = 0;
    this.totCumplimiento = 0;
    this.totRegistros = this.technicalSheets.length;

    for (const sheet of this.technicalSheets) {
      if (sheet.NO_BIEN !== null) {
        if (sheet.CUMPLIO_FT === 1) {
          this.totCumplidos++;
        } else {
          this.totNoCumplidos++;
        }
      }
    }

    if (this.totRegistros !== 0) {
      this.totCumplimiento = (this.totCumplidos / this.totRegistros) * 100;
    }
  }

  generateWhereClause(event: any) {
    // Obtener los valores del formulario
    const initDate = this.form.get('initDate').value;

    const endDate = this.form.get('endDate').value;
    const proceedingsSiab = this.form.get('proceedingsSiab').value;
    const initAct = this.form.get('initAct').value;
    const endAct = this.form.get('endAct').value;
    const userUploadAct = this.form.get('userUploadAct').value;
    const regCoordination = this.form.get('regCoordination').value;
    const transf = this.form.get('transf').value;
    const issuing = this.form.get('issuing').value;
    const authority = this.form.get('authority').value;

    // Lógica para generar la cláusula WHERE a partir de los valores del formulario
    let vBAN = false;
    let lv_ranfechas = '';
    let lv_expedient = '';
    let lv_rang_acta: string = '';

    let lv_coor_regi: string = '';
    let lv_usuarios: string = '';
    // Resto de la lógica de generación de la cláusula WHERE ...

    // Asignar la cláusula WHERE generada al atributo DWHERE
    this.DWHERE = '';

    if (
      initDate >= new Date('2008-05-01') &&
      initDate <= new Date('2300-12-01')
    ) {
      this.DWHERE = ` ESTATUS not in ('ATP') AND TIPO_ACTA in ('ENTREGA') ${lv_ranfechas} ${lv_expedient} ${lv_rang_acta} ${lv_coor_regi} ${lv_usuarios}`;
    } else {
      this.DWHERE = ` ESTATUS not in ('ATP') AND DESALOJO_DIADIA = 0 and TIPO_ACTA in ('ENTREGA') and DESTINO in(1,3) ${lv_ranfechas} ${lv_expedient} ${lv_rang_acta} ${lv_coor_regi} ${lv_usuarios}`;
    }

    // PUP_GENERA_WHERE - Parte faltante
    if (this.form.get('transf').value) {
      this.DWHERE = `${this.DWHERE} AND (NO_TRANSFERENTE IN (${
        this.form.get('transf').value
      })`;
      vBAN = true;
    }
    if (this.form.get('issuing').value) {
      if (vBAN) {
        this.DWHERE = `${this.DWHERE} OR (NO_TRANSFERENTE, NO_EMISORA) IN (${
          this.form.get('issuing').value
        })`;
      } else {
        this.DWHERE = `${this.DWHERE} AND ((NO_TRANSFERENTE, NO_EMISORA) IN (${
          this.form.get('issuing').value
        })`;
        vBAN = true;
      }
    }
    if (this.form.get('authority').value) {
      if (vBAN) {
        this.DWHERE = `${
          this.DWHERE
        } OR (NO_TRANSFERENTE, NO_EMISORA, NO_AUTORIDAD) IN (${
          this.form.get('authority').value
        })`;
      } else {
        this.DWHERE = `${
          this.DWHERE
        } AND ((NO_TRANSFERENTE, NO_EMISORA, NO_AUTORIDAD) IN (${
          this.form.get('authority').value
        })`;
        vBAN = true;
      }
    }
    if (vBAN) {
      this.DWHERE = `${this.DWHERE})`;
      console.log(this.DWHERE);
      console.log(vBAN);
    }
  }

  exportarArchivoBase() {
    const params = {
      fechaInicial: this.BLK_PARAM.FEC_INICIAL,
      fechaFinal: this.BLK_PARAM.FEC_FINAL,
      noDelegacion: this.BLK_PARAM.NO_DELEGACION,
    };

    // Determina qué cursor utilizar (C_DATOS o C_DATOS2) según la fecha
    const cursor = this.isBeforeMayDate(this.BLK_PARAM.FEC_INICIAL)
      ? this.myService.getDatosCursorC_DATOS(params)
      : this.myService.getDatosCursorC_DATOS2(params);

    // Realizar solicitud al backend para obtener los datos
    cursor.subscribe(
      (response: any[]) => {
        // Generar el contenido del archivo CSV con los datos obtenidos
        const csvContent = this.generateCSVContent(response);

        // Guardar el archivo CSV en el servidor o proporcionar un enlace de descarga al usuario
        //this.saveCSVFile(csvContent);
      },
      (error: any) => {
        console.error(
          'Error al obtener los datos para el archivo base: ',
          error
        );
      }
    );
  }

  isBeforeMayDate(date: Date): boolean {
    const mayDate = new Date('2008-05-01');
    return date.getTime() < mayDate.getTime();
  }

  generateCSVContent(data: any[]): string {
    let csvContent =
      'CVE_DICTAMEN,OFICIO,EXPEDIENTE,PROGRAMA,VOLANTE,FEC_VOLANTE,FEC_DESAHOGO,FEC_MAXIMA,USUARIO,CUMPLIO\n';
    for (const item of data) {
      csvContent +=
        item.DESALOJO_DIADIA +
        ',"' +
        (item.NO_BIEN ? item.NO_BIEN : '') +
        '","' +
        (item.ESTATUS ? item.ESTATUS : '') +
        '","' +
        (item.FEC_RECEP ? item.FEC_RECEP : '') +
        '","' +
        (item.FEC_FOTO ? item.FEC_FOTO : '') +
        '","' +
        (item.FEC_MAXIMA ? item.FEC_MAXIMA : '') +
        '","' +
        (item.FOTOGRAFIA ? item.FOTOGRAFIA : '') +
        '","' +
        (item.FEC_MAXIMA ? item.FEC_MAXIMA : '') +
        '","' +
        (item.CUMPLIO ? item.CUMPLIO : '') +
        '","' +
        (item.TIPO_ACTA ? item.TIPO_ACTA : '') +
        '","' +
        (item.DESTINO ? item.DESTINO : '') +
        '","' +
        (item.USUARIO ? item.USUARIO : '') +
        '"\n';
    }
    return csvContent;
  }

  saveCSVFile() {
    let csvContent: string;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'archivo_base.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  // ... Resto de la lógica para el manejo de NO_TRANSFERENTE, NO_EMISORA, NO_AUTORIDAD ...
  // Se omite aquí para no extender demasiado el código

  /*exportToCSV(): void {
    const filename = 'hoja1.csv'; // Nombre del archivo CSV
    this.exportService.exportToCSV(this.technicalSheets, filename);
  }*/
}
