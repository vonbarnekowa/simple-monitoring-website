import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import {AgentSchema} from '../schemas/Agent';
import {MonitorSchema} from '../schemas/Monitors';
import {log} from '../server/log';

const Monitor = mongoose.model('monitors', MonitorSchema);
const Agent = mongoose.model('agent', AgentSchema);

export const dashboard = async (ctx: Koa.Context) => {
  await Monitor.find({})
    .exec()
    .catch((err) => {
      log.error(err);
    })
    .then(async (monitors) => {
      await ctx.render('dash', {monitors, success: ctx.session.success, error: ctx.session.error});
      ctx.session.success = null;
      ctx.session.error = null;
    });
};

export const agent = async (ctx: Koa.Context) => {
  await Agent.find({})
    .exec()
    .catch((err) => {
      log.error(err);
    })
    .then(async (agents) => {
      await ctx.render('agent', {agents, success: ctx.session.success, error: ctx.session.error});
      ctx.session.success = null;
      ctx.session.error = null;
    });
};
