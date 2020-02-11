import HttpException from './HttpException';

class BetNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Bet with id ${id} not found`);
  }
}

export default BetNotFoundException;
