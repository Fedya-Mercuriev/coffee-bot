import { ContextMessageUpdate } from 'telegraf';
import MenuButton from 'menu-button';
/**
 * @param button - current button object;
 * @param ctx - a context message update object;
 * @param menuType - a page on which the menu is (main, order etc);
 */

export default function addLocaleToMenu(
  button: MenuButton,
  ctx: ContextMessageUpdate,
  path: string
): string {
  return ctx.i18n.t(`menus.${path}.${button.name}`);
}
