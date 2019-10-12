import { ContextMessageUpdate } from 'telegraf';
import request from 'request-promise';
import app from '../_app';
import { displayError, hideError } from './error-handler';

function login(ctx: ContextMessageUpdate, password?: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      const loginData = {
        username: password ? process.env.ADMIN_LOGIN : process.env.USER_LOGIN,
        password: password ? password : process.env.USER_PASSWORD
      };
      const response = await request.post(
        `${process.env.API_DOMAIN}/api-token-auth/`,
        {
          form: {
            username: loginData.username,
            password: loginData.password
          }
        }
      );
      ctx.session.token = JSON.parse(response).token;
      await hideError(ctx);
      resolve(true);
    } catch (error) {
      if (error.statusCode === 400) {
        await displayError({
          ctx: ctx,
          errorMsg: ctx.i18n.t('errors.wrongPassword')
        });
      } else {
        await displayError({
          ctx: ctx,
          errorMsg: ctx.i18n.t('errors.common'),
          callback: 'login',
          args: [ctx]
        });
      }
      resolve(false);
    }
  });
}

app.bind('login', login);
export default login;
