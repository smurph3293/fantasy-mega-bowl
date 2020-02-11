import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import BetController from './bet/bet.controller';
import PostController from './post/post.controller';
import ReportController from './report/report.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new ReportController(),
    new BetController(),
  ],
);

app.listen();
