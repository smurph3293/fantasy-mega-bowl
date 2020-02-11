import User from '../user/user.interface';

interface Bet {
  owner: User;
  opponents: User;
  title: string;
  description: string;
  imageUrl: string;
  createAt: Date;
  completed: boolean;
}

export default Bet;
