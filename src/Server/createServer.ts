import http from 'http';
import { envConfig } from '../common/config';
import { getAllUsers, createUser, deleteUser, updateUser, getUserByID } from '../services/User.router';
import { MethodType } from './Server.types';
import { NotFoundError } from '../Errors/CustomErrors';
import { HandleError } from '../Errors/handler.error';
import { BASE_URL } from '../utils/constants';

const SERVER_ROUTES = {
    GET: getUserByID,
    POST: createUser,
    DELETE: deleteUser,
    PUT: updateUser
}

export const createServer = (port = envConfig.SERVER_PORT) => {
    const server = http.createServer(async (req, res) => {
        const method = req.method as MethodType;
        const url: string | undefined = req.url;
        try {
            if (url?.startsWith(BASE_URL)) {
                if (method === 'GET' && url === BASE_URL) await getAllUsers(req, res);
                else {
                    await SERVER_ROUTES[method](req, res)
                };
            } else {
                throw new NotFoundError();
            }
        } catch (err) {
            HandleError(req, res, err);
        }
    })
    server.listen(port, () => {
        console.log(`Server running at port ${port}`)
    });
    return server;
}
