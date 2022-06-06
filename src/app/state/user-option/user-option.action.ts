import { UserOptionStateModel } from './user-option.state';

export class UpdateUserOption {
  static readonly type = '[UserOption] Update';
  constructor(public payload: Partial<UserOptionStateModel>) {}
}