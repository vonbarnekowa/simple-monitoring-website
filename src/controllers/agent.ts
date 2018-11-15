import * as Koa from 'koa';
import * as mongoose from 'mongoose';
import {Constants} from '../contants';
import {log} from '../server/log';
import {AgentSchema} from '../schemas/Agent';

const Agent = mongoose.model('agent', AgentSchema);

interface IAgent {
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
      key: getKey(),
    })
      .save()
      .catch((error) => {
        log.error(error);
        ctx.session.error = Constants.AGENT_ADD_ERROR;
        ctx.redirect(Constants.AGENT_URL);
      })
      .then((res) => {
        ctx.session.success = Constants.AGENT_ADD_SUCCESS;
        ctx.redirect(Constants.AGENT_URL);
      });
  } else {
    ctx.redirect(Constants.AGENT_URL);
  }

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
        ctx.redirect(Constants.AGENT_URL);
      })
      .then((res) => {
        ctx.session.success = Constants.AGENT_UPDATE_SUCCESS;
        ctx.redirect(Constants.AGENT_URL);
      });
  } else {
    ctx.redirect(Constants.AGENT_URL);
  }
};

export const deleteAgent = async (ctx: Koa.Context) => {
  await Agent.findByIdAndDelete(ctx.params.id)
    .exec()
    .catch((error) => {
      log.error(error);
      ctx.session.error = Constants.AGENT_DELETE_ERROR;
      ctx.redirect(Constants.AGENT_URL);
    })
    .then((doc) => {
      ctx.session.success = Constants.AGENT_DELETE_SUCCESS;
      ctx.redirect(Constants.AGENT_URL);
    });
};

const getKey = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 24; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
