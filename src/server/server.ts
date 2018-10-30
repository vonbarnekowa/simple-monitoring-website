import * as Koa from 'koa';
import * as views from 'koa-views';
import * as bodyparser from 'koa-bodyparser';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as GoogleStrategy from 'passport-google-oauth';

import { config } from './config';
import { logger } from './logging';
import { routes } from './routes';

const app = new Koa();

passport.use(new GoogleStrategy.OAuth2Strategy({
    clientID: '',
    clientSecret: '',
    callbackURL: '/login/google/callback',
  },
  function(accessToken, refreshToken, profile, done) {
    // TODO
    /*User.findOrCreate(..., function (err, user) {
      done(err, user);
    });*/
  }
));

app.use(views( 'src/views/', {
    map: {
      html: 'handlebars'
    }
  }
));

app.use(bodyparser());

app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);
app.use(routes);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
