import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import {MonitorSchema} from '../schemas/Monitors';
import {log} from '../server/log';

const Monitor = mongoose.model('monitors', MonitorSchema);

export const home = async (ctx: Koa.Context) => {
  await Monitor.find({is_public: true})
    .exec()
    .catch((err) => {
      log.error(err);
    })
    .then(async (monitors) => {
      await ctx.render('home', {monitors, success: ctx.session.success, error: ctx.session.error, is_public: true});
      ctx.session.success = null;
      ctx.session.error = null;
    });
};
