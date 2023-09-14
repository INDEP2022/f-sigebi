export interface IEventPreparationBlkProp {
  eventBlk: IBlkGrants;
  lotComerBlk: IBlkGrants;
  goodsLotsBlk: IBlkGrants;
  comerAdjBlk: IBlkGrants;
}

interface IBlkGrants {
  insert?: boolean;
  update?: boolean;
  delete?: boolean;
}
