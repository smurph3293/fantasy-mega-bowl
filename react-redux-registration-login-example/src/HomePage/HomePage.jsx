import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions, betActions } from '../_actions';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: '',
            opponents: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getUsers();
        this.props.getBets();
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    handleDeleteBet(id) {
        return (e) => this.props.deleteBet(id);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { title, description } = this.state;
        var { opponents } = this.state;
        const { user, users } = this.props;
        users.items.forEach(u => {
            if (u.firstName === opponents) {
                opponents = u;
            }
        })
        console.log(`props: ${JSON.stringify(this.props)}\n and state: ${JSON.stringify(this.state)}`);
        console.log(`submitting: ${title}, ${description}, ${opponents}, ${JSON.stringify(user)}`);
        if (title && description && opponents) {

            this.props.createBet(title, description, opponents, user);
        }
    }

    render() {
        console.log(`rendering: ${JSON.stringify(this.props)}`);
        const { user, users, bets } = this.props;
        const { title, description, opponents, submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React!!</p>

                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {user.firstName + ' ' + user.lastName}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user._id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }

                <h3>All your Bets:</h3>
                {bets.loading && <em>Loading bets...</em>}
                {bets.error && <span className="text-danger">ERROR: {bets.error}</span>}
                {bets.items &&
                    <ul>
                        {bets.items.map((bet, index) =>
                            <li key={bet.id}>
                                {bet.owner.firstName + ' CHALLENGES ' + bet.opponents.firstName + ' to: ' + bet.title + ' ' + bet.description}
                                {
                                    bet.deleting ? <em> - Deleting...</em>
                                    : bet.deleteError ? <span className="text-danger"> - ERROR: {bet.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteBet(bet._id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }


                <h2>Create Bet</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !title ? ' has-error' : '')}>
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" name="title" value={title} onChange={this.handleChange} />
                        {submitted && !title &&
                            <div className="help-block">Title is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !description ? ' has-error' : '')}>
                        <label htmlFor="description">Description</label>
                        <input type="text" className="form-control" name="description" value={description} onChange={this.handleChange} />
                        {submitted && !description &&
                            <div className="help-block">Description is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !opponents ? ' has-error' : '')}>
                        <label htmlFor="opponents">Opponents</label>
                        <input type="text" className="form-control" name="opponents" value={opponents} onChange={this.handleChange} />
                        {submitted && !opponents &&
                            <div className="help-block">At least one opponent must be chosen</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Create Bet</button>
                    </div>
                </form>

                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    console.log(`this is home page state: ${JSON.stringify(state)}`);
    const { users, authentication, bets } = state;
    const { user } = authentication;
    return { user, users, bets };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete,
    getBets: betActions.getAll,
    deleteBet: betActions.delete,
    createBet: betActions.create,
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };