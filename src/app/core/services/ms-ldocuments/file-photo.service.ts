import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { IDocumentEndpoints } from 'src/app/common/constants/endpoints/ms-idocument-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { IListResponseMessage } from '../../interfaces/list-response.interface';

const Tiff = require('tiff.js');
const LOADING_GIF = 'assets/images/loader-button.gif';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
export interface IHistoricalPhoto {
  name: string;
  goodNumber: string;
  userDeleted: string;
  deletedDate: Date;
}

export interface IPhotoFile {
  no_bien: string;
  no_consec: number;
  fec_foto: string;
  ubicacion: string;
  no_registro: number;
  fec_foto_hc: string;
  publ_img_cat_web?: any;
  existe_fs: number;
  existe_prod?: any;
  nb_origen?: any;
  usuario_creacion: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilePhotoService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
  constructor(private sanitizer: DomSanitizer) {
    super();
    this.microservice = IDocumentEndpoints.Base;
  }

  getAll(goodNumber: string): Observable<IPhotoFile[]> {
    return this.post<IListResponseMessage<IPhotoFile>>(
      IDocumentEndpoints.filePhotos,
      { goodNumber }
    ).pipe(
      catchError(x => of({ data: [] as IPhotoFile[] })),
      map(response => {
        if (response && response.data) return response.data;
        else {
          return [];
        }
      })
    );
  }

  getById(goodNumber: string, consecNumber: number) {
    return this.post<string>(IDocumentEndpoints.filePhoto, {
      goodNumber,
      consecNumber,
    });
  }

  getAllWidthPhotos(goodNumber: string): Observable<string[]> {
    return this.getAll(goodNumber).pipe(
      map(response => {
        if (response && response.length > 0)
          return response.map(item =>
            this.getById(
              goodNumber,
              +item.name.substring(item.name.indexOf('F'), item.name.length)
            )
          );
        else {
          return [];
        }
      }),
      mergeMap(x => this.validationForkJoin(x))
    );
  }

  getAllHistoric(goodNumber: string) {
    return this.post<IListResponseMessage<IHistoricalPhoto>>(
      IDocumentEndpoints.filePhotosHistoric,
      { goodNumber }
    ).pipe(
      catchError(x => of({ data: [] as IHistoricalPhoto[] })),
      map(response => {
        if (response && response.data) return response.data.map(item => item);
        else {
          return [];
        }
      })
    );
  }

  getByIdHistoric(goodNumber: string, consecNumber: number) {
    return this.post<string>(IDocumentEndpoints.filePhotoHistoric, {
      goodNumber,
      consecNumber,
    });
  }

  // getAllWidthPhotosHistoric(
  //   goodNumber: string
  // ): Observable<{ image: string; usuarioElimina: string }[]> {
  //   return this.getAll(goodNumber).pipe(
  //     catchError(x => of([] as string[])),
  //     map(response => {
  //       if (response && response.length > 0)
  //         return response.map(item => {
  //           let index = item.indexOf('F');
  //           return this.getById(
  //             goodNumber,
  //             +item.substring(index + 1, index + 5)
  //           ).pipe(
  //             catchError(x => of(null)),
  //             map(x => {
  //               return {
  //                 image: this.base64Change(x, item),
  //                 usuarioElimina:
  //                   'Usuario eliminó moto1.jpg ' +
  //                   'Nombre: SIGEBIADMON Fecha: 29/06/2023',
  //               };
  //             })
  //           );
  //           // return this.getByIdHistoric(
  //           //   goodNumber,
  //           //   +item.substring(index + 1, index + 11)
  //           // );
  //         });
  //       else {
  //         return [];
  //       }
  //     }),
  //     mergeMap(x => this.validationForkJoin(x))
  //   );
  // }

  // private base64Change(base64: string, filename: string) {
  //   if (!base64) {
  //     return null;
  //   }
  //   const bytesSize = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812;
  //   // this.documentLength = bytesSize / 1000;
  //   const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
  //   // TODO: Checar cuando vengan pdf, img etc
  //   return ext.toLowerCase().includes('tif')
  //     ? this.getUrlTiff(base64, filename)
  //     : this.getUrlDocument(base64, filename);
  //   // this.mimeType = getMimeTypeFromBase64(this.imgSrc as string, this.filename);
  // }

  // private getUrlTiff(base64: string, filename: string) {
  //   try {
  //     const buffer = Buffer.from(base64, 'base64');
  //     const tiff = new Tiff({ buffer });
  //     const canvas: HTMLCanvasElement = tiff.toCanvas();
  //     canvas.style.width = '100%';
  //     console.log('llego aca', filename);
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(canvas.toDataURL());
  //   } catch (error) {
  //     // this.error = true;
  //     // console.log(this.error);
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(NO_IMAGE_FOUND);
  //   }
  // }

  // private getUrlDocument(base64: string, filename: string) {
  //   let mimeType;
  //   mimeType = getMimeTypeFromBase64(base64, filename);
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(
  //     `data:${mimeType};base64, ${base64}`
  //   );
  // }

  deletePhoto(goodNumber: string, consecNumber: string) {
    const user = localStorage.getItem('username').toUpperCase();
    return this.delete(IDocumentEndpoints.deletePhoto, {
      goodNumber,
      consecNumber,
      user,
    });
  }

  uploadFile(identificator: any, file: File, fileField: string = 'file') {
    const filename = file.name;
    const ext = filename.substring(filename.lastIndexOf('.') + 1) ?? '';
    const formData = new FormData();
    formData.append(fileField, file, `FU_${uuidv4()}.${ext}`);
    formData.append('goodNumber', `${identificator}`);
    const user = localStorage.getItem('username').toUpperCase();
    // formData.append('consecNumber', this.consecNumber++ + '');
    formData.append('userCreation', user);
    formData.append('recordNumber', '305315076');
    formData.append('photoDate', new Date().toISOString());
    formData.append('photoDateHc', new Date().toISOString());
    const request = new HttpRequest(
      'POST',
      `${this._url}${this.microservice}/${this._prefix}${IDocumentEndpoints.savePhoto}`,
      formData,
      { reportProgress: true, responseType: 'json' }
    );
    return this.httpClient.request(request).pipe(
      catchError(error => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }
}
