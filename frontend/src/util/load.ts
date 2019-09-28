import request from 'request-promise';
import app from '../_app';
import { ContextMessageUpdate } from 'telegraf';

const load = async function<T>(
  url: string,
  ctx?: ContextMessageUpdate,
  options?: request.RequestPromiseOptions
): Promise<T> {
  return request
    .get(url, options)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.log(e);
    });
};

app.bind('load', load);
export default load;
