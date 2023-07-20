import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { CreateReportComponent } from '../../shared-request/create-report/create-report.component';
import { RejectRequestModalComponent } from '../../shared-request/reject-request-modal/reject-request-modal.component';

@Component({
  selector: 'app-request-comp-doc-tasks',
  templateUrl: './request-comp-doc-tasks.component.html',
  styles: [],
})
export class RequestCompDocTasksComponent extends BasePage implements OnInit {
  /* CALL TABS DINAMICALY */
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  /**
   * SET STATUS OF TABS
   **/
  regDocForm: boolean = false;
  regDocView: boolean = false;
  searchRequestSimGoods: boolean = false;
  selectGoods: boolean = false;
  guidelines: boolean = false;
  docRequest: boolean = false;
  expRequest: boolean = false;
  viewSelectedGoods: boolean = false;
  dictumValidate: boolean = false;
  /**
   * SET STATUS ACTIONS
   **/
  saveRequest: boolean = false;
  turnReq: boolean = false;
  createReport: boolean = false;
  rejectReq: boolean = false;

  requestId: number = 0;
  contributor: string = '';
  processDetonate: string = '';
  process: string = '';
  title: string;
  requestInfo: any;
  screenWidth: number;
  public typeDoc: string = '';
  public updateInfo: boolean = false;
  typeModule: string = '';
  displayExpedient: boolean = false;
  complementaryDoc: boolean = false;

  /* INJECTIONS
  ============== */
  private requestService = inject(RequestService);
  private requestHelperService = inject(RequestHelperService);
  private affairService = inject(AffairService);
  /*  */
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    super();
    this.screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  }

  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('request'));
    this.process = this.route.snapshot.paramMap.get('process');
    console.log('process', this.process);
    //this.route.paramMap.subscribe(params => {
    if (requestId) {
      //this.requestId = parseInt(params.get('request'));
      this.getRequestInfo(requestId);
      /**
       *MAP TASKS
       * */
    }
    //});

    this.expedientEventTrigger();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let screenWidth = window.innerWidth;
    this.screenWidth = screenWidth;
  }

  getRequestInfo(requestId: number) {
    // Llamar servicio para obtener informacion de la solicitud
    //const process = this.route.snapshot.paramMap.get('process');
    const param = new FilterParams();
    param.addFilter('id', requestId);
    const filter = param.getParams();
    this.requestService.getAll(filter).subscribe({
      next: resp => {
        this.requestInfo = resp.data[0];
        this.titleView();
        this.requestId = resp.data[0].id;
        this.mapTasks(this.process, resp.data[0].affair);
        this.getAffair(resp.data[0].affair);
        //cierra el tab de buscar bienes solicitudes
        this.closeSearchRequestSimGoodsTab(resp.data[0].recordId);
      },
    });
    this.contributor = 'CARLOS G. PALMA';
  }

  titleView() {
    if (this.requestInfo?.affair == 13) {
      this.title = `DOCUMENTACIÓN COMPLEMENTARIA: Registro de Documentación Complementaria, No. Solicitud ${this.requestInfo.id}`;
      this.complementaryDoc = true;
    } else if (this.requestInfo?.affair == 10) {
      this.title = `Devolución: Registro de documentación complementaria, No. Solicitud ${this.requestInfo.id}`;
      this.complementaryDoc = true;
    }
  }

  expedientSelected(event: any) {
    if (event == true) {
      this.displayExpedient = true;
      this.requestSelected(1);
    }
  }
  requestSelected(type: number) {
    this.typeDocumentMethod(type);
    this.updateInfo = true;
    this.typeModule = 'doc-complementary';
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        break;
      default:
        break;
    }
  }

  close() {
    // this.registRequestForm.reset();
    //this.router.navigate(['pages/request/list']);
    this.location.back();
  }

  requestRegistered(request: any) {}

  openReport(context?: Partial<CreateReportComponent>): void {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
      } //this.getCities();
    });
  }

  turnRequest() {
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestId}?`,
      '',
      'Turnar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }

  rejectRequest(): void {
    const modalRef = this.modalService.show(RejectRequestModalComponent, {
      initialState: {
        title: 'Confirmar Rechazo',
        message: '¿Está seguro que desea rechazar el análisis?',
        requestId: this.requestId,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReject.subscribe((data: boolean) => {
      if (data) {
      }
    });
  }

  mapTasks(process: string, affair: number): void {
    console.log('process', process);
    console.log('affair', affair);
    //REGISTRAR SOLICITUD
    /*regRequest
    associateReqSimGoods
    selectOriginGoods
    requestSiabSearch
    integrateDocFile
    turn
    //Revision de lineamientos
    receive
    guidelinesReview
    integrateDocFile
    createReport
    turn
    //GENERAR RESULTADOS
    receiveRequest
    reject//AnalysisResults
    guidelinesReview
    integrateDocFile
    sign
    turn
    //Validar dictamen
    receive// request for opinion validation
    reject// opinion validation
    regOpinionValidation
    integrateDocFile
    createReport
    turn*/

    switch (process) {
      case 'register-request':
        /* if (affair == 13) { */
        this.regDocForm = true;
        this.regDocView = false;
        this.searchRequestSimGoods = true;
        this.selectGoods = false;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        /* } else if (affair == 10) {
          this.searchRequestSimGoods = true;
          this.regDocForm = true;
          this.selectGoods = true;
          this.expRequest = true;
        } */

        break;
      case 'guidelines-review':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = false;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = false;

        break;
      case 'analysis-result':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = true;

        break;
      case 'dictum-validate':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = true;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = true;

        break;
      case 'similar-good-register-documentation':
        this.regDocForm = true;
        this.regDocView = false;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;
      default:
        break;
    }
  }

  /*METODO QUE OYE CUANDO LA CARATULA SE CREO
  ============================================= */
  expedientEventTrigger() {
    this.requestHelperService.currentExpedient.subscribe({
      next: resp => {
        if (resp == true) {
          const requestId = Number(this.route.snapshot.paramMap.get('request'));
          this.staticTabs.tabs[0].active = true;
          this.getRequestInfo(requestId);
        }
      },
    });
  }

  /* METODO QUE CIERRA EL TAB DE CREAR CARATULA
  ============================================== */
  closeSearchRequestSimGoodsTab(recordId: number) {
    if (recordId) {
      this.searchRequestSimGoods = false;
    }
  }

  endRequest() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea finalizar la tarea registro de documentación complementaria?'
    ).then(question => {
      if (question) {
        //Cerrar tarea//
      }
    });
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.processDetonate = data.processDetonate;
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  }
}
