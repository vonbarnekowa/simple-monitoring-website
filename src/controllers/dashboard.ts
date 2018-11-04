import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import {Constants} from '../contants';
import {log} from '../server/log';
import {MonitorSchema} from '../schemas/Monitors';

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
