import * as Koa from 'koa';
import * as mongoose from 'mongoose';
import {Constants} from '../contants';
import {MonitorSchema} from '../schemas/Monitors';
import {log} from '../server/log';

const Monitor = mongoose.model('monitors', MonitorSchema);
const allowedChecksPerDay = [1, 2, 4, 8, 16, 32, 48, 144, 288, 1440];

interface IMonitor {
  name: string;
  address: string;
  frequency: string;
  is_public: string;
}

export const addMonitor = async (ctx: Koa.Context) => {
  let isError = false;
  const body = (ctx.request.body as IMonitor);

  if (ctx.response == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.address == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.frequency == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name.trim().length < 1) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.address.trim().length < 1) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && !(allowedChecksPerDay.indexOf(parseInt(body.frequency, 10)) > -1)) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError) {
    await new Monitor({
      user_id: ctx.session.passport.user._id,
      name: body.name.trim(),
      address: body.address.trim(),
      status: 1,
      is_public: (body.is_public == 'on') ? true : false,
      frequency: body.frequency,
    })
      .save()
      .catch((error) => {
        log.error(error);
        ctx.session.error = Constants.MONITOR_ADD_ERROR;
        ctx.redirect(Constants.DASHBOARD_URL);
      })
      .then((res) => {
        ctx.session.success = Constants.MONITOR_ADD_SUCCESS;
        ctx.redirect(Constants.DASHBOARD_URL);
      });
  } else {
    ctx.redirect(Constants.DASHBOARD_URL);
  }
};

export const updateMonitor = async (ctx: Koa.Context) => {
  let isError = false;
  const body = (ctx.request.body as IMonitor);

  if (ctx.response == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body == null) {
    ctx.session.error = Constants.GENERIC_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.address == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.frequency == null) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.name.trim().length < 1) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && body.address.trim().length < 1) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError && !allowedChecksPerDay.indexOf(parseInt(body.frequency, 10))) {
    ctx.session.error = Constants.FORM_ERROR_MESSAGE;
    isError = true;
  }

  if (!isError) {
    await Monitor.findOneAndUpdate({_id: ctx.params.id}, {
      name: body.name.trim(),
      address: body.address.trim(),
      is_public: (body.is_public == 'on') ? true : false,
      frequency: body.frequency,
    })
      .exec()
      .catch((error) => {
        log.error(error);
        ctx.session.error = Constants.MONITOR_UPDATE_ERROR;
        ctx.redirect(Constants.DASHBOARD_URL);
      })
      .then((res) => {
        ctx.session.success = Constants.MONITOR_UPDATE_SUCCESS;
        ctx.redirect(Constants.DASHBOARD_URL);
      });
  } else {
    ctx.redirect(Constants.DASHBOARD_URL);
  }
};

export const deleteMonitor = async (ctx: Koa.Context) => {
  await Monitor.findByIdAndDelete(ctx.params.id)
    .exec()
    .catch((error) => {
      log.error(error);
      ctx.session.error = Constants.MONITOR_DELETE_ERROR;
      ctx.redirect(Constants.DASHBOARD_URL);
    })
    .then((doc) => {
      ctx.session.success = Constants.MONITOR_DELETE_SUCCESS;
      ctx.redirect(Constants.DASHBOARD_URL);
    });
};
