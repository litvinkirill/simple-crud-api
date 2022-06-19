import { getAll, create, remove, update, searchUser } from "./User.service";
import { RouterCallbackFunc } from "../Server/Server.types";
import { HandleError } from "../Errors/handler.error";
import { BASE_URL } from "../utils/constants";
import { NotFoundError } from "../Errors/CustomErrors";

const getAllUsers: RouterCallbackFunc = async (req, res) => {
        try {
            const users = await getAll();
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(users));
        } catch (err) {
            HandleError(req, res, err);
        }
};

const createUser: RouterCallbackFunc = async (req, res) => {
    if (req.url !== BASE_URL) throw new NotFoundError();
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', async () => {
        let userData;
        try {
            userData = JSON.parse(data);
            const newUser = await create(userData);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (err) {
            HandleError(req, res, err);
        }
    })
}

const deleteUser: RouterCallbackFunc = async (req, res) => {
    try {
        const url = req.url;
        const userId = url?.substring(`/${BASE_URL}`.length);
        await remove(userId as string);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (err) {
        HandleError(req, res, err);
    }
}

const updateUser: RouterCallbackFunc = async (req, res) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', async () => {
        let userData;
        try {
            userData = JSON.parse(data);
            const url = req.url;
            const userId = url?.substring(`/${BASE_URL}`.length);
            await update(userId as string, userData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userData));
        } catch (err) {
            HandleError(req, res, err);
        }
    })
}

const getUserByID: RouterCallbackFunc = async (req, res) => {
    try {
        const url = req.url;
        const userId = url?.substring(`/${BASE_URL}`.length);
        const currentUser = searchUser(userId as string);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentUser));
    } catch (err) {
        HandleError(req, res, err);
    }
}

export { getAllUsers, createUser, deleteUser, updateUser, getUserByID }