import request from 'request-promise';
import app from '../_app';
import { ContextMessageUpdate } from 'telegraf';

const load = async function<T>(
  url: string,
  ctx?: ContextMessageUpdate,
  options?: request.RequestPromiseOptions
): Promise<T> {
  let requestUrl =
    url.search(process.env.API_DOMAIN) !== -1
      ? url
      : `${process.env.API_DOMAIN}${url}`;
  return request
    .get(requestUrl, options)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.log(e);
    });
};

app.bind('load', load);
export default load;
