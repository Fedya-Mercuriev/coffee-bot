import request from 'request-promise';
import app from '../_app';
import { ContextMessageUpdate } from 'telegraf';
import { displayError } from './error-handler';

const load = async function<T>(
  url: string,
  ctx?: ContextMessageUpdate,
  options?: request.RequestPromiseOptions
): Promise<T> {
  let requestUrl =
    url.search(process.env.API_DOMAIN) !== -1
      ? url
      : `${process.env.API_DOMAIN}${url}`;
  const requestHeaders = {
    headers: {
      Authorization: `Token ${ctx.session.token}`
    }
  };
  const requestOptions = Object.assign({}, requestHeaders, options);
  return request
    .get(requestUrl, requestOptions)
    .then(response => {
      return response;
    })
    .catch(e => {
      displayError({
        ctx: ctx,
        errorMsg: e.message
      });
    });
};

app.bind('load', load);
export default load;
