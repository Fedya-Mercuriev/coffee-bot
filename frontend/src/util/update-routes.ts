import { ContextMessageUpdate } from 'telegraf';

export default async function updateRoutes(
  ctx: ContextMessageUpdate,
  customRoute?: string
) {
  if (customRoute) {
    ctx.session.route = customRoute;
    return;
  }
  ctx.session.route = ctx.session.currentMenu.get(
    ctx.update.callback_query.data
  ).url;
}
