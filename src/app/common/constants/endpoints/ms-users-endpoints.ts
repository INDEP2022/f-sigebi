export enum UserEndpoints {
  BasePath = 'users',
  SegUsers = 'seg-users', // seg-users
  SegAccessAreas = 'seg-access-x-areas', // seg-access-x-areas
  GetUserName = `seg-access-x-areas/get-user-name`,
  VigSupervisionAccess = 'vig-supervision-access',
  UserAsigne = 'seg-users/user-assigned',
  GetAllSegUser = 'seg-users/get-all-seg-user',
  DelegationUser = 'seg-access-x-areas/getDelegation',

  //consulta del form
  askForPermissions = 'factadboficiogestrel/delete-when-button-pressed',
  GetNameEmail = 'seg-access-x-areas/getNameEmail',
  GetDisName = 'seg-access-x-areas/getDisNameEmail',
  ProNameEmail = 'seg-access-x-areas/procNameEmail',
  ComerUsersAutXEvent = 'comer-usersautxevent',
  NameOtval = 'ind-user/get-name-otval-user',

  IndUserNoInd = 'ind-user/noind',
  FaValUserInd = 'seg-users/fa-val-user-ind',
  GetText = 'seg-users/getText',
  GetUserOt = 'seg-users/getuserOt',
  SpInsertWithcopyOfficial = 'seg-users/sp-insert-withcopy-official',
  ComerUser = 'comer-usersautxcanc',
  RecDeleg = 'application/recDeleg',
  RecSubDel = 'application/recSubdel',
  RecVault = 'application/recVault',
  viewPrev = 'application/btnViewPrev',
}
