import * as Koa from 'koa';
import * as passport from 'passport';
import {Constants} from '../contants';

export const login = passport.authenticate('google', {scope: ['email']});

export const loginCallback = passport.authenticate('google',
  {successRedirect: Constants.DASHBOARD_URL, failureRedirect: Constants.HOME_URL});

export const logout = async (ctx: Koa.Context) => {
  ctx.logout();
  ctx.redirect(Constants.HOME_URL);
};
