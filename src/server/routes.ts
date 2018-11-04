import * as Router from 'koa-router';
import * as passport from 'passport';

import {Context} from 'koa';
import {Constants} from '../contants';
import {login, loginCallback, logout} from '../controllers/authentication';

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

router.get(Constants.HOME_URL, isUnauthenticated, async (ctx) => {
  await ctx.render('home', {error: ctx.session.error});
});

// Authentication
router.get(Constants.LOGIN_GOOGLE_CALLBACK_URL, isUnauthenticated, loginCallback);
router.get(Constants.LOGIN_GOOGLE_URL, isUnauthenticated, login);
router.get(Constants.LOGOUT_URL, isAuthenticated, logout);

router.get(Constants.DASHBOARD_URL, isAuthenticated, async (ctx) => {
  await ctx.render('dash');
});

export const routes = router.routes();
