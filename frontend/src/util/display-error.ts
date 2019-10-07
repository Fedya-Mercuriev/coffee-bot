import { ContextMessageUpdate } from 'telegraf';
import MenuStructure from './prepare-menu-structure';
import { buildMenu } from './keyboards';

export default async function displayError(options: {
  ctx: ContextMessageUpdate;
  errorMsg: string;
  callback?: string;
  args?: any[];
}) {
  const { ctx, errorMsg, callback, args } = options;
  let menuStructure: any = {
    name: ctx.i18n.t('buttons.try_again'),
    data: {
      cb: {
        name: callback,
        args: args.join(',')
      }
    }
  };
  menuStructure = new MenuStructure(JSON.stringify(menuStructure));
  await ctx.reply(`🚫 ${errorMsg}`, buildMenu(ctx, menuStructure.menu).extra());
}
