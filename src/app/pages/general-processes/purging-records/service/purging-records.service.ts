import { Injectable } from '@angular/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ProtectionService } from 'src/app/core/services/catalogs/protection.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';

@Injectable({
  providedIn: 'root',
})
export class PurgingRecordsService {
  private searchParams = new ListParams();
  private goodsToUpdate: Partial<IGood[]> = [];
  constructor(
    private goodService: GoodService,
    private notificationService: NotificationService,
    private jobsService: JobsService,
    private protectionService: ProtectionService,
    private accountMovementService: AccountMovementService,
    private documentsService: DocumentsService
  ) {
    this.searchParams.limit = 100;
  }

  updateAll(oldExpedient: string | number, newExpedient: string | number) {
    const old = Number(oldExpedient);
    const _new = Number(newExpedient);
    return forkJoin([
      this.updateGoods(old, _new),
      this.updateNotifications(old, _new),
      this.updateOffices(old, _new),
      this.udpateAccountMovements(old, _new),
      this.updateDocuments(old, _new),
    ]);
  }

  // Obtener los bienes con el expediete de origen y acualizarlos al nuevo
  private updateGoods(old: number, _new: number) {
    return this.goodService.getByExpedient(old, this.searchParams).pipe(
      switchMap(response => {
        return forkJoin(
          response.data.map(good => {
            const { id } = good;
            return of(id);
          })
        );
      })
    );
  }

  // Actualizar notificaciones
  private updateNotifications(old: number, _new: number) {
    const params = new FilterParams();
    params.limit = 1;
    params.addFilter('expedientNumber', _new);
    return this.getAllNotifications(params.getParams()).pipe(
      map(response => response.data[0] ?? null),
      switchMap(notification => {
        params.removeAllFilters();
        params.addFilter('expedientNumber', old);
        params.limit = 100;
        return this.getAllNotifications(params.getParams()).pipe(
          map(_response => {
            return { notifications: _response.data, notification };
          })
        );
      }),
      map(data => {
        return data.notifications.map(_noti => {
          const {
            expedientNumber,
            preliminaryInquiry,
            criminalCase,
            circumstantialRecord,
            touchPenaltyKey,
            protectionKey,
            entFedKey,
          } = data.notification;
          return {
            wheelNumber: _noti.wheelNumber,
            expedientNumber,
            preliminaryInquiry,
            criminalCase,
            circumstantialRecord,
            touchPenaltyKey,
            protectionKey,
            entFedKey,
          };
        });
      }),
      switchMap(newNotifications => {
        const obs = newNotifications.map(noti =>
          this.notificationService.update(noti.wheelNumber, noti)
        );
        return forkJoin(obs);
      })
    );
  }

  private getAllNotifications(params: _Params) {
    return this.notificationService.getAllFilter(params);
  }

  // Actualizar oficios
  private updateOffices(old: number, _new: number) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('recordNumber', old);
    return this.jobsService.getAllFiltered(params.getParams()).pipe(
      map(response => response.data),
      switchMap(jobs =>
        forkJoin(
          jobs.map(job =>
            this.jobsService.update(job.id, { ...job, recordNumber: _new })
          )
        )
      )
    );
  }

  // Actualizar amparos
  //  TODO: No se puede obtener amparos por numero de expediente
  private updateProtections(old: number, _new: number) {
    this.protectionService.getAll();
  }

  // Actualizar movimientos de cuenta
  private udpateAccountMovements(old: number, _new: number) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('numberProceedings', old);
    return this.accountMovementService.getAllFiltered(params.getParams()).pipe(
      map(response => response.data),
      switchMap(movements =>
        forkJoin(
          movements.map(movement =>
            this.accountMovementService.update({
              numberMotion: movement.numberMotion,
              numberAccount: movement.numberAccount,
              numberProceedings: _new,
            })
          )
        )
      )
    );
  }

  // Actualizar documentos
  updateDocuments(old: number, _new: number) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('numberProceedings', old);
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      map(response => response.data),
      switchMap(documents =>
        forkJoin(
          documents.map(document =>
            this.documentsService.update(document.id, {
              numberProceedings: _new,
            })
          )
        )
      )
    );
  }
}
