import * as Router from 'koa-router';
import * as passport from 'passport';

import {Context} from 'koa';
import {Constants} from '../contants';

const router = new Router();

const isAuthenticated = (ctx: Context) => {
  if (ctx.isUnauthenticated()) {
    return ctx.redirect(Constants.LOGIN_URL);
  }
};

const isUnauthenticated = (ctx: Context) => {
  if (ctx.isAuthenticated()) {
    return ctx.redirect(Constants.DASHBOARD_URL);
  }
};

router.get(Constants.HOME_URL, isUnauthenticated, async (ctx) => {
  await ctx.render('home.handlebars');
});

router.get(Constants.LOGIN_GOOGLE_CALLBACK_URL, isUnauthenticated,
  passport.authenticate('google',
    {successRedirect: Constants.DASHBOARD_URL, failureRedirect: Constants.LOGIN_URL}));

router.get(Constants.LOGIN_GOOGLE_URL, isUnauthenticated,
  passport.authenticate('google', {scope: ['email']}));

router.get(Constants.DASHBOARD_URL, isAuthenticated, async (ctx) => {
  await ctx.render('home.handlebars');
});

export const routes = router.routes();
