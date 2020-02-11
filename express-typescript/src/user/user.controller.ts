import * as express from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import postModel from '../post/post.model';
import betModel from '../bet/bet.model';
import userModel from '../user/user.model';
import User from './user.interface';

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private post = postModel;
  private bet = betModel;
  private user = betModel;
  private localUsers: User[] = [
                  {"_id":"5e1ac6e6ab52d935a34e3589","firstName":"Sean","lastName":"Murphy","status":true,"createdAt":new Date(),"phone":426975587,"email":"sean@test.com"},
                  {"_id":"9b3ac6e6ab52d935a34e9991","firstName":"JOSH","lastName":"fake","status":false,"createdAt":new Date(),"phone":421345587,"email":"fake@email.com"}           
              ];

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllUsers);
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
    this.router.get(`${this.path}/:id/bets`, authMiddleware, this.getAllBetsOfUser);
  }

  private getAllUsers = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    //const posts = await this.user.find()
    //.populate('-password');
    //response.send(posts);
    response.send(this.localUsers);
  }

  private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
    next(new NotAuthorizedException());
  }

  private getAllBetsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const bets = await this.bet.find({ ownerId: userId });
      response.send(bets);
    }
    next(new NotAuthorizedException());
  }
}

export default UserController;
