import * as Router from 'koa-router';

import {Context} from 'koa';
import {Constants} from '../contants';
import {login, loginCallback, logout} from '../controllers/authentication';
import {dashboard} from '../controllers/dashboard';
import {home} from '../controllers/home';
import {addMonitor, deleteMonitor, updateMonitor} from '../controllers/monitor';

const router = new Router();

const isAuthenticated = (ctx: Context, next: () => void) => {
  if (ctx.isAuthenticated()) {
    return next();
  }
  return ctx.redirect(Constants.HOME_URL);
};

const isUnauthenticated = (ctx: Context, next: () => void) => {
  if (ctx.isUnauthenticated()) {
    return next();
  }
  return ctx.redirect(Constants.DASHBOARD_URL);
};

router.get(Constants.HOME_URL, isUnauthenticated, home);

router.get(Constants.DASHBOARD_URL, isAuthenticated, dashboard);

// Authentication
router.get(Constants.LOGIN_GOOGLE_CALLBACK_URL, isUnauthenticated, loginCallback);
router.get(Constants.LOGIN_GOOGLE_URL, isUnauthenticated, login);
router.get(Constants.LOGOUT_URL, isAuthenticated, logout);

// Monitor controller
router.post(Constants.ADD_MONITOR_URL, isAuthenticated, addMonitor);
router.post(Constants.UPDATE_MONITOR_URL, isAuthenticated, updateMonitor);
router.get(Constants.DELETE_MONITOR_URL, isAuthenticated, deleteMonitor);

export const routes = router.routes();
