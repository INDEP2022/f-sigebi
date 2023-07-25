import { inject } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';

export abstract class CompDocTasksComponent extends BasePage {
  protected abstract regDocForm: boolean;
  protected abstract regDocView: boolean;
  protected abstract searchRequestSimGoods: boolean;
  protected abstract selectGoods: boolean;
  protected abstract guidelines: boolean;
  protected abstract docRequest: boolean;
  protected abstract expRequest: boolean;
  protected abstract selectGoodForEyeVisit: boolean;
  protected abstract viewSelectedGoods: boolean;
  protected abstract dictumValidate: boolean;
  protected abstract notifyReport: boolean;
  protected abstract saveRequest: boolean;
  protected abstract turnReq: boolean;
  protected abstract createReport: boolean;
  protected abstract rejectReq: boolean;
  protected abstract title: string;
  protected abstract complementaryDoc: boolean;
  protected abstract requestInfo: IRequest;

  private rejectedService = inject(RejectedGoodService);

  constructor() {
    super();
  }

  titleView(affair: number) {
    if (affair == 13) {
      this.title = `DOCUMENTACIÓN COMPLEMENTARIA: Registro de Documentación Complementaria, No. Solicitud ${this.requestInfo.id}`;
      this.complementaryDoc = true;
    } else if (affair == 10) {
      this.title = `Devolución: Registro de documentación complementaria, No. Solicitud ${this.requestInfo.id}`;
      this.complementaryDoc = true;
    }
  }

  mapTask(process: string, affair?: number) {
    console.log('affair', affair);
    switch (process) {
      case 'register-request':
        if (affair == 13) {
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
          this.notifyReport = false;
          this.selectGoodForEyeVisit = false;

          this.turnReq = true;
          this.createReport = false;
          this.rejectReq = false;
        } else if (affair == 10) {
          this.searchRequestSimGoods = true;
          this.regDocForm = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.selectGoodForEyeVisit = false;
        }

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
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
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
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;

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
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;

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
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = true;

        break;
      case 'BSRegistroSolicitudes':
        //registro del formulario
        this.regDocForm = true;
        this.regDocView = false;
        //buscar solicitudes de bienes
        this.searchRequestSimGoods = true;
        //seleccionar bienes
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = false;
        //expedientes
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;
      case 'BSNotificarTransferente':
        this.regDocForm = false;
        //ver registro
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = false;
        //visualizar los bienes seleccioandos
        this.viewSelectedGoods = true;
        this.guidelines = false;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = true;
        this.selectGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;
      case 'BSVisitaOcular':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = false;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = true;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;

      default:
        break;
    }
  }

  getGoodResDev(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.rejectedService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(
            'error no se pudo obtener los bienes de la tabla good-res-dev'
          );
        },
      });
    });
  }

  turnResquestMessage(requestId: number) {
    Swal.fire({
      title: `Desea turnar la solicitud con el folio: ${requestId}`,
      text: 'Usted va a transferir una solicitud que no es comercio exterior a un TE',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }
}
