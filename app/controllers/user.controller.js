import {apiSuccessHandler, apiFailureHandler} from '../helpers/global.helper';
import configuredDB from '../config/database';

const {Users} = configuredDB;

/**
 * user controller
 */
export default class UserController {
    /**
     * get users data
     *
     * @param req
     * @param res
     */
    getUser(req, res) {
        try {
            const {user} = req;
            if (user) {
                return apiSuccessHandler(res, 200, null, user);

            } else {
                return apiFailureHandler(res, 400, 'Invalid user.');
            }
        } catch (error) {
            return apiFailureHandler(res, 500, null, error);
        }
    }

    /**
     * update user data
     *
     * @param req
     * @param res
     */
    async updateUser(req, res) {
        const {userId} = req;
        let {body: userData} = req;

        const userUpdateFields = ['firstName', 'lastName', 'mobileNumber', 'address', 'city', 'postalCode', 'status'];
        await Object.keys(userData).map(function (key) {
            if (userUpdateFields.indexOf(key) === -1) {
                delete userData[key];
            }
        });

        if (!userData || Object.keys(userData).length === 0) {
            return apiFailureHandler(res, 400, 'User data not exist.');
        }

        try {
            Users.update(userData, {
                where: {
                    id: userId
                },
            }).then((result) => {
                if (result) {
                    return apiSuccessHandler(res, 200, 'User data updated.');
                }

                return apiFailureHandler(res, 400, 'User data not updated. Please try again.');
            });
        } catch (error) {
            return apiFailureHandler(res, 500, null, error);
        }
    }

    /**
     * delete user
     *
     * @param req
     * @param res
     */
    async deleteUser(req, res) {
        const {userId} = req;

        try {
            Users.destroy({
                where: {id: userId},
            }).then((result) => {
                if (result) {
                    return apiSuccessHandler(res, 200, 'User deleted.');
                }

                return apiFailureHandler(res, 400, 'User not deleted. Please try again.');
            });
        } catch (error) {
            return apiFailureHandler(res, 500, null, error);
        }
    }
}