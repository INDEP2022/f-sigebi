import { firstValueFrom, map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { SatTransferService } from 'src/app/core/services/ms-interfacesat/sat-transfer.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class juridicalRecordUpdateRequest extends BasePage {
  protected abstract opinionService: OpinionService;
  protected abstract notificationService: NotificationService;
  protected abstract satTransferenceService: SatTransferService;
  protected abstract dictationService: DictationService;
  protected getCatDictation(id: number | string, firstRecord = false) {
    // if (firstRecord) {
    //   params.page = 1;
    //   params.limit = 1;
    // }
    return firstValueFrom(
      this.opinionService
        .getOpinionById(id)
        .pipe
        /* map(response => {
          if (firstRecord) {
            return response.data[0];
          } else {
            return response;
          }
        } )*/
        ()
    );
  }

  getNotification(params: ListParams, firstRecord = false) {
    /*  SELECT CVE_DICTAMEN
          INTO :GLOBAL.VARDIC 
          FROM NOTIFICACIONES
         WHERE NO_VOLANTE = :BLK_NOT.NO_VOLANTE; */
    if (firstRecord) {
      params.page = 1;
      params.limit = 1;
    }
    return firstValueFrom(
      this.notificationService.getAll(params).pipe(
        map(response => {
          if (firstRecord) {
            return response.data[0];
          }
          return response;
        })
      )
    );
  }

  getSatTransference(jobNumber: string, firstRecord = false) {
    /* SELECT COUNT(0)
					INTO EXISTE
					FROM SAT_TRANSFERENCIA
				 WHERE SAT_DETERMINANTE||'-'||SAT_NUMOFICTRANSF = :BLK_NOT.CVE_OFICIO_EXTERNO; */
    return firstValueFrom(
      this.satTransferenceService
        .JobAsunto3({ jobNumber, page: 1, limit: 1 })
        .pipe(map(res => res.count))
    );
  }

  getPgrTransference(params: _Params) {
    // SELECT COUNT(0)
    // 				INTO EXISTE
    // 				FROM PGR_TRANSFERENCIA
    // 			 WHERE PGR_OFICIO  = :BLK_NOT.CVE_OFICIO_EXTERNO;
    return firstValueFrom(this.satTransferenceService.getPgrTransfers(params));
  }

  getRTdictaAarusr(params: ListParams) {
    // from R_TDICTA_AARUSR
    return firstValueFrom(
      this.dictationService
        .getRTdictaAarusr(params)
        .pipe
        // map(response => {
        //   return response.data[0];
        // })
        ()
    );
  }
}
