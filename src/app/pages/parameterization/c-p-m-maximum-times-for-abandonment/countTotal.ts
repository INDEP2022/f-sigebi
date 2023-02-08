import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export function countTotalsManifes(data: IGoodType[]): IGoodType[] {
  data.map(item => {
    item.total =
      Number(item.maxAsseguranceTime) +
      Number(item.maxExtensionTime) +
      Number(item.maxFractionTime) +
      Number(item.maxStatementTime);
  });
  return data;
}

export function countTotalsGet(data: IGoodType[]): IGoodType[] {
  data.map(item => {
    item.total2 =
      Number(item.maxLimitTime1) +
      Number(item.maxLimitTime2) +
      Number(item.maxLimitTime3);
  });
  return data;
}
