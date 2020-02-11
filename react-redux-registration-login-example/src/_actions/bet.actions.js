import { betConstants } from '../_constants';
import { betService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const betActions = {
    create,
    getAll,
    delete: _delete
};

function create(title, description, opponents, user) {
    return dispatch => {
        dispatch(request({ title }));

        betService.create(title, description, opponents, user)
            .then(
                bet => { 
                    dispatch(success(bet));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(bet) { return { type: betConstants.CREATE_REQUEST, bet } }
    function success(bet) { return { type: betConstants.CREATE_SUCCESS, bet } }
    function failure(error) { return { type: betConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        betService.getAll()
            .then(
                bets => dispatch(success(bets)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: betConstants.GETALL_REQUEST } }
    function success(bets) { return { type: betConstants.GETALL_SUCCESS, bets } }
    function failure(error) { return { type: betConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        betService.delete(id)
            .then(
                bet => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: betConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: betConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: betConstants.DELETE_FAILURE, id, error } }
}