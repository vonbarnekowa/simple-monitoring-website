import * as Router from 'koa-router';
import * as passport from 'passport';

const router = new Router();

router.get('/', async (ctx) => {
  await ctx.render('home.handlebars');
});

/*router.get('/login/google/callback', async (ctx) => {
    return passport.authenticate('google', {failureRedirect: '/login'}, (err, user, info, status) => {
      if (err) {
        console.error(err);
      }
      ctx.redirect('/');
    })(ctx);
});*/
router.get('/login/google/callback',
  passport.authenticate('google', {successRedirect: '/', failureRedirect: '/login'}));

router.get('/login/google', passport.authenticate('google', {scope: ['email']}));

router.get('/dashboard', async (ctx) => {
  if (ctx.isUnauthenticated()) {
    ctx.redirect('/');
    return;
  }
});

export const routes = router.routes();
