import * as Router from 'koa-router';
import * as passport from 'passport';

import {Context} from 'koa';
import {Constants} from '../contants';

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
  await ctx.render('home');
});

router.get(Constants.LOGIN_GOOGLE_CALLBACK_URL, isUnauthenticated,
  passport.authenticate('google',
    {successRedirect: Constants.DASHBOARD_URL, failureRedirect: Constants.HOME_URL}));

router.get(Constants.LOGIN_GOOGLE_URL, isUnauthenticated,
  passport.authenticate('google', {scope: ['email']}));

router.get(Constants.LOGOUT_URL, isAuthenticated, async (ctx) => {
  ctx.logout();
  ctx.redirect(Constants.HOME_URL);
});

router.get(Constants.DASHBOARD_URL, isAuthenticated, async (ctx) => {
  await ctx.render('dash');
});

export const routes = router.routes();
