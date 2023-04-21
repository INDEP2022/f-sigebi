import { Injectable } from '@angular/core';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PartializeGoodEndpoints } from 'src/app/common/constants/endpoints/ms-partialize-good-endpoint';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { HttpService } from 'src/app/common/services/http.service';
import {
  IListResponse,
  IListResponseMessage,
} from '../../interfaces/list-response.interface';
import { ITreeItem } from '../../interfaces/menu.interface';
import {
  IPartializedGoodList,
  IPartializedGoods,
} from '../../models/ms-partialize-goods/partialize-good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodPartializeService extends HttpService {
  private readonly endpoint = PartializeGoodEndpoints.Partializeds;
  constructor() {
    super();
    this.microservice = PartializeGoodEndpoints.BasePath;
  }

  getTTTTTTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string,
    gGrandsonIndicator: string,
    ggGreatGrandsonIndicator: string,
    gggGreatGrandsonIndicator: string,
    ggggGreatGrandsonIndicator: string,
    gggggGreatGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$not:$null' +
        '&filter.ggGreatGrandsonIndicator=$not:$null&filter.gggGreatGrandsonIndicator=$not:$null' +
        '&filter.ggggGreatGrandsonIndicator=$not:$null&filter.gggggGreatGrandsonIndicator=$not:$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&filter.gGrandsonIndicator=$eq:' +
        gGrandsonIndicator +
        '&filter.ggGreatGrandsonIndicator=$eq:' +
        ggGreatGrandsonIndicator +
        '&filter.gggGreatGrandsonIndicator=$eq:' +
        gggGreatGrandsonIndicator +
        '&filter.ggggGreatGrandsonIndicator=$eq:' +
        ggggGreatGrandsonIndicator +
        '&filter.gggggGreatGrandsonIndicator=$eq:' +
        gggggGreatGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return {
                  noBien: item.goodNumber.id,
                  description: item.description,
                  subItems: [],
                };
              })
            : []
          : []
      )
    );
  }

  getTTTTTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string,
    gGrandsonIndicator: string,
    ggGreatGrandsonIndicator: string,
    gggGreatGrandsonIndicator: string,
    ggggGreatGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$not:$null' +
        '&filter.ggGreatGrandsonIndicator=$not:$null&filter.gggGreatGrandsonIndicator=$not:$null' +
        '&filter.ggggGreatGrandsonIndicator=$not:$null&filter.gggggGreatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&filter.gGrandsonIndicator=$eq:' +
        gGrandsonIndicator +
        '&filter.ggGreatGrandsonIndicator=$eq:' +
        ggGreatGrandsonIndicator +
        '&filter.gggGreatGrandsonIndicator=$eq:' +
        gggGreatGrandsonIndicator +
        '&filter.ggggGreatGrandsonIndicator=$eq:' +
        ggggGreatGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.gggggGreatGrandsonIndicator
                  ? this.getTTTTTTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      greatGrandsonIndicator,
                      gGrandsonIndicator,
                      ggGreatGrandsonIndicator,
                      gggGreatGrandsonIndicator,
                      ggggGreatGrandsonIndicator,
                      item.gggggGreatGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getTTTTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string,
    gGrandsonIndicator: string,
    ggGreatGrandsonIndicator: string,
    gggGreatGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    // let array: Observable<ITreeItem>[] = [];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$not:$null' +
        '&filter.ggGreatGrandsonIndicator=$not:$null&filter.gggGreatGrandsonIndicator=$not:$null' +
        '&filter.ggggGreatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&filter.gGrandsonIndicator=$eq:' +
        gGrandsonIndicator +
        '&filter.ggGreatGrandsonIndicator=$eq:' +
        ggGreatGrandsonIndicator +
        '&filter.gggGreatGrandsonIndicator=$eq:' +
        gggGreatGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.ggggGreatGrandsonIndicator
                  ? this.getTTTTTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      greatGrandsonIndicator,
                      gGrandsonIndicator,
                      ggGreatGrandsonIndicator,
                      gggGreatGrandsonIndicator,
                      item.ggggGreatGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getTTTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string,
    gGrandsonIndicator: string,
    ggGreatGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$not:$null' +
        '&filter.ggGreatGrandsonIndicator=$not:$null&filter.gggGreatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&filter.gGrandsonIndicator=$eq:' +
        gGrandsonIndicator +
        '&filter.ggGreatGrandsonIndicator=$eq:' +
        ggGreatGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.gggGreatGrandsonIndicator
                  ? this.getTTTTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      greatGrandsonIndicator,
                      gGrandsonIndicator,
                      ggGreatGrandsonIndicator,
                      item.gggGreatGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getTTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string,
    gGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$not:$null' +
        '&filter.ggGreatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&filter.gGrandsonIndicator=$eq:' +
        gGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.ggGreatGrandsonIndicator
                  ? this.getTTTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      greatGrandsonIndicator,
                      gGrandsonIndicator,
                      item.ggGreatGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getTNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string,
    greatGrandsonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$not:$null&filter.gGreatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&filter.greatGrandsonIndicator=$eq:' +
        greatGrandsonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.gGrandsonIndicator
                  ? this.getTTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      greatGrandsonIndicator,
                      item.gGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getBNietos(
    fatherIndicator: string,
    childIndicator: string,
    grandSonIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$not:$null' +
        '&filter.gGrandsonIndicator=$null&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&filter.grandSonIndicator=$eq:' +
        grandSonIndicator +
        '&sortBy=fatherIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.greatGrandsonIndicator
                  ? this.getTNietos(
                      fatherIndicator,
                      childIndicator,
                      grandSonIndicator,
                      item.greatGrandsonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getNietos(
    fatherIndicator: string,
    childIndicator: string
  ): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorBNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$not:$null&filter.greatGrandsonIndicator=$null' +
        '&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&filter.childIndicator=$eq:' +
        childIndicator +
        '&sortBy=grandSonIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? //   ? data.data.length > 0
            //     ? data.data.map(item => {
            //       return {
            //         noBien: item.goodNumber.id,
            //         description: item.description,
            //         subItems: [],
            //       };
            //     })
            //     : []
            //   : []

            data.data.length > 0
            ? data.data.map(item => {
                return item.grandSonIndicator
                  ? this.getBNietos(
                      fatherIndicator,
                      childIndicator,
                      item.grandSonIndicator
                    ).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => {
        console.log(array);
        return this.validationObs(array);
      })
    );
  }

  getSons(fatherIndicator: string): Observable<ITreeItem[]> {
    // let data: ITreeItem[] = [
    //   {
    //     noBien: '2249068',
    //     description:
    //       'PEA, BIEN POR 960 PIEZAS, (PRODUCTO DE LA PARCIALIZACIÓN DE BIEN NO.1987808 (7683 PIEZAS),  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM))',
    //     subItems: [],
    //     indicadorNieto: 1,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$not:$null' +
        '&filter.grandSonIndicator=$null&filter.fatherIndicator=$eq:' +
        fatherIndicator +
        '&sortBy=childIndicator:ASC'
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        // data.data
        //   ? data.data.length > 0
        //     ? data.data.map(item => {
        //       return {
        //         noBien: item.goodNumber.id,
        //         description: item.description,
        //         subItems: [],
        //       };
        //     })
        //     : []
        //   : []

        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.childIndicator
                  ? this.getNietos(fatherIndicator, item.childIndicator).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        console.log(subItems);
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getByGoodNumber(goodNumber: number): Observable<ITreeItem[]> {
    // const data: ITreeItem[] = [
    //   {
    //     noBien: '1987808',
    //     description:
    //       'BIEN(ES) GENERADO(S): 2249068, 2249069, 2249070, 2249071, 2249072, 2249073;  MUÑECOS DE PELUCHE (QUE USAN BATERIAS);MYM)',
    //     subItems: [],
    //     indicadorHijo: 1,
    //   },
    //   {
    //     noBien: '1987809',
    //     description:
    //       'BIEN(ES) GENERADO(S): 2248619, 2248620, 2248621, 2248622, 2248623, 2248624, 2248625, 2248626;  MUÑECOS DE PELUCHE MYM',
    //     subItems: [],
    //     indicadorHijo: 2,
    //   },
    // ];
    return this.get<IListResponse<IPartializedGoods>>(
      this.endpoint +
        '?filter.fatherIndicator=$not:$null&filter.childIndicator=$null' +
        `&filter.goodNumber=$eq:${goodNumber}&sortBy=fatherIndicator:DESC`
    ).pipe(
      catchError(err => of({ data: [] as IPartializedGoods[] })),
      map(data =>
        data.data
          ? data.data.length > 0
            ? data.data.map(item => {
                return item.fatherIndicator
                  ? this.getSons(item.fatherIndicator).pipe(
                      catchError(err => of([] as ITreeItem[])),
                      map(subItems => {
                        return {
                          noBien: item.goodNumber.id,
                          description: item.description,
                          subItems,
                        };
                      })
                    )
                  : of({
                      noBien: item.goodNumber.id,
                      description: item.description,
                      subItems: [],
                    });
              })
            : []
          : []
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getTreePartialize(goodNumber: number = 1439629) {
    let data: ITreeItem[] = [
      {
        noBien: 'HT PARCIALIZADOS',
        subItems: [],
      },
    ];
    // let array: Observable<ITreeItem>[] = [];
    // data[0].subItems = await firstValueFrom(this.getSons(indicadorPadre));
    return of(data).pipe(
      map(data =>
        data.map(item => {
          return this.getByGoodNumber(goodNumber).pipe(
            catchError(err => of([] as ITreeItem[])),
            map(subItems => {
              console.log(subItems);
              return {
                ...item,
                subItems,
              };
            })
          );
        })
      ),
      mergeMap(array => this.validationObs(array))
    );
  }

  getAll(params: _Params) {
    return this.get<IListResponseMessage<IPartializedGoods>>(
      this.endpoint,
      params
    ).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(item => {
            return {
              goodNumber: item.goodNumber.id,
              description: item.description,
              partializedId: item.partializedId,
            } as IPartializedGoodList;
          }),
        };
      })
    );
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }
}
