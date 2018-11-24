import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';
import * as mongoose from 'mongoose';

import {Document} from 'mongoose';
import {Constants} from '../contants';
import {AgentSchema} from '../schemas/Agent';
import {log} from '../server/log';

const Agent = mongoose.model('agent', AgentSchema);

interface IAgent extends Document {
  name: string;
  key: string;
}

export const addAgent = async (ctx: Koa.Context) => {
  let isError = false;
  const body = (ctx.request.body as IAgent);

  if (ctx.response == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError) {

    await new Agent({
      name: body.name.trim(),
    })
      .save()
      .catch((error) => {
        log.error(error);
        ctx.session.error = Constants.AGENT_ADD_ERROR;
      })
      .then((res) => {

        const obj = {_id: (res as IAgent)._id, name: (res as IAgent).name};
        const token = jwt.sign(obj, process.env.SECRET);

        Agent.findOneAndUpdate({_id: (res as IAgent)._id}, {key: token})
          .exec()
          .catch((error) => {
            log.error(error);
            ctx.session.error = Constants.AGENT_ADD_ERROR;
          })
          .then((result) => {
            ctx.session.success = Constants.AGENT_ADD_SUCCESS;
          });
      });
  }
  ctx.redirect(Constants.AGENT_URL);
  ctx.session.success = null;
  ctx.session.error = null;

};

export const updateAgent = async (ctx: Koa.Context) => {
  let isError = false;
  const body = (ctx.request.body as IAgent);

  if (ctx.response == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError) {
    await Agent.findOneAndUpdate({_id: ctx.params.id}, {
      name: body.name.trim(),
    })
      .exec()
      .catch((error) => {
        log.error(error);
        ctx.session.error = Constants.AGENT_UPDATE_ERROR;
      })
      .then((res) => {
        ctx.session.success = Constants.AGENT_UPDATE_SUCCESS;
      });
  }
  ctx.redirect(Constants.AGENT_URL);
  ctx.session.success = null;
  ctx.session.error = null;
};

export const deleteAgent = async (ctx: Koa.Context) => {
  await Agent.findByIdAndDelete(ctx.params.id)
    .exec()
    .catch((error) => {
      log.error(error);
      ctx.session.error = Constants.AGENT_DELETE_ERROR;
    })
    .then((doc) => {
      ctx.session.success = Constants.AGENT_DELETE_SUCCESS;
    });

  ctx.redirect(Constants.AGENT_URL);
  ctx.session.success = null;
  ctx.session.error = null;
};

const getKey = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 24; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
