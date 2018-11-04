import * as fs from 'fs';
import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as logger from 'koa-logger-winston';
import * as passport from 'koa-passport';
import * as session from 'koa-session';
import * as serve from 'koa-static';
import * as views from 'koa-views';
import * as mongoose from 'mongoose';
import * as GoogleOauth from 'passport-google-oauth';

import {Profile} from 'passport';
import {Constants} from '../contants';
import {config} from './config';
import {log} from './log';

import {routes} from './routes';

import {MonitorSchema} from '../schemas/Monitors';
import {UsersSchema} from '../schemas/Users';

const app = new Koa();

app.keys = ['secret', 'key'];

mongoose.connect(Constants.MONGODB_CONNECT_URL, {useNewUrlParser: true}, (err: mongoose.Error) => {
  if (err) {
    return log.error(err);
  }
});

const User = mongoose.model('users', UsersSchema);
const Monitor = mongoose.model('monitors', MonitorSchema);

const contents = fs.readFileSync('google_api.json');
const googleApiInfo = JSON.parse(contents.toString());

passport.use(new GoogleOauth.OAuth2Strategy({
    clientID: googleApiInfo.web.client_id,
    clientSecret: googleApiInfo.web.client_secret,
    callbackURL: Constants.LOGIN_GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  }, ((req: any, accessToken: string, refreshToken: string, profile: Profile,
       done: (err: any, user?: any) => void) => {

    User.findOne({email: profile.emails[0].value}, (err: any, user: any) => {
      if (err) {
        log.error(err);
        return done(err, false);
      }

      if (user) {
        log.info('User ' + user.email + ' successfully connected');
        return done(err, user);
      }
      req.session.error = 'You haven\'t access to the administration';
      return done(err, false);
    });
  }),
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return log.error(err);
    }

    done(err, user);
  });
});

app.use(views('views/templates', {
    map: {
      njk: 'nunjucks',
    },
    extension: 'njk',
    options: {
      settings: {
        views: 'views',
      },
    },
  },
));

app.use(serve('./public'));
app.use(bodyparser());
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger(log));
app.use(routes);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
