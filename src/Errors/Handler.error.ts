import { RouterCallbackFunc } from "../Server/Server.types";
import { BaseError, NotFoundError, ServerInternalError } from "./CustomErrors";
import { ERROR_MESSAGES } from "./error.messages";


const HandleError: RouterCallbackFunc = (req, res, err) => {
    if (err instanceof BaseError) {
        res.statusCode = err.code;
        res.end(err.message);
    }
    else if (err instanceof SyntaxError) {
        res.statusCode = 400;
        res.end(`
        There is a SyntaxError
        There are the possible reasons:
        1)Unexpected token } in JSON -> Remove last comma
        2)Wrong comma in hobbies, replace single quotes with double quotes`);
    }
    else if (err instanceof NotFoundError) {
        res.statusCode = err.code;
        res.end(ERROR_MESSAGES.NOT_FOUND);
    } else {
        const { code, message } = new ServerInternalError();
        res.statusCode = code;
        res.end(message);
    }
}

export { HandleError }