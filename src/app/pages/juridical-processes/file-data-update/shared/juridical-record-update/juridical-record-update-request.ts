import { firstValueFrom, map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { SatTransferService } from 'src/app/core/services/ms-interfacesat/sat-transfer.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class juridicalRecordUpdateRequest extends BasePage {
  protected abstract opinionService: OpinionService;
  protected abstract notificationService: NotificationService;
  protected abstract satTransferenceService: SatTransferService;

  protected getCatDictation(id: number | string, firstRecord = false) {
    // if (firstRecord) {
    //   params.page = 1;
    //   params.limit = 1;
    // }
    return firstValueFrom(
      this.opinionService
        .getById(id)
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

  getSatTransference(officeExternalKey: string, firstRecord = false) {
    /* SELECT COUNT(0)
					INTO EXISTE
					FROM SAT_TRANSFERENCIA
				 WHERE SAT_DETERMINANTE||'-'||SAT_NUMOFICTRANSF = :BLK_NOT.CVE_OFICIO_EXTERNO; */
    return firstValueFrom(
      this.satTransferenceService.byOffice2({ officeExternalKey })
    );
  }

  getPgrTransference(officeExternalKey: string | number) {
    // SELECT COUNT(0)
    // 				INTO EXISTE
    // 				FROM PGR_TRANSFERENCIA
    // 			 WHERE PGR_OFICIO  = :BLK_NOT.CVE_OFICIO_EXTERNO;
    return firstValueFrom(
      this.satTransferenceService.getPgrTransfer({ officeExternalKey })
    );
  }
}
