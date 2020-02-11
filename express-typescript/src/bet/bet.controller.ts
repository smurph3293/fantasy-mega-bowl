import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import BetNotFoundException from '../exceptions/BetNotFoundException';
import betModel from './bet.model';
import CreateBetDto from './bet.dto';
import Bet from './bet.interface';

class BetController implements Controller {
  public path = '/bets';
  public router = express.Router();
  private bet = betModel;
  private localBets: CreateBetDto[] = [];

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}/*`, authMiddleware)
        .get(`${this.path}`, this.getAllBets)
        .post(`${this.path}`, validationMiddleware(CreateBetDto, true), this.createBet)
        .delete(`${this.path}/:id`, this.deleteBet);
  }

  private getAllBets = async (request: express.Request, response: express.Response) => {
    //const bets = await this.bet.find();
      // .populate('author', '-password');
    const bets = this.localBets;
    response.send(bets);
  }

  private createBet = async (request: RequestWithUser, response: express.Response) => {
    const betData: CreateBetDto = request.body;
    console.log(`betData: ${JSON.stringify(betData)}`);
    const createdBet = new this.bet({
      ...betData,
      // ownerId: request.user._id,
    });
    console.log(`CREATING BET: ${JSON.stringify(createdBet)}`);
    //const savedBet = await createdBet.save();
    this.localBets.push(betData);
    const savedBet = createdBet;
    // await savedPost.populate('author', '-password').execPopulate();
    response.send(savedBet);
  }

  private deleteBet = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    console.log(`id: ${id} ||| params: ${JSON.stringify(request.params)}`);
    //const successResponse = await this.bet.findByIdAndDelete(id);
    this.localBets.pop();
    console.log(`localbets after delte: ${JSON.stringify(this.localBets)}`);
    const successResponse = true;
    if (successResponse) {
      response.sendStatus(200);
    } else {
      next(new BetNotFoundException(id));
    }
  }
}

export default BetController;
