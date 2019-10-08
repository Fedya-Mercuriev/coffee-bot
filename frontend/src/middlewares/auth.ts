import { ContextMessageUpdate } from 'telegraf';
import login from '../util/login';

export default function auth(
  ctx: ContextMessageUpdate,
  next: Function
): Function {
  if (
    ctx.updateType !== 'message' &&
    ctx.updateSubTypes.indexOf('text') === -1
  ) {
    return next();
  }
  const password = ctx.update.message.text;

  if (password.search('admin') !== -1) {
    login(ctx, password).then((): Function => next());
  } else {
    return next();
  }
}
