import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import {MonitorSchema} from '../schemas/Monitors';
import {log} from '../server/log';

const Monitor = mongoose.model('monitors', MonitorSchema);

export const dashboard = async (ctx: Koa.Context) => {
  await Monitor.find({})
    .exec()
    .catch((err) => {
      log.error(err);
    })
    .then(async (monitors) => {
      await ctx.render('dash', {monitors: monitors});
    });
};
