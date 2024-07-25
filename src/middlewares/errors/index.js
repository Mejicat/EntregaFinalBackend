import { ErrorCodes } from "../../services/errors/enums.js";

//error -> contiene la Excepción Custom lanzada
export default (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name });
            break;
        case ErrorCodes.MISSING_DATA_ERROR:
            res.status(400).send({ status: 'error', error: error.name });
            break;
        case ErrorCodes.INVALID_VALUE_ERROR:
            res.status(400).send({ status: 'error', error: error.name });
            break;
        default:
            res.status(500).send({ status: 'error', error: 'Unhandled error' });
    }
}