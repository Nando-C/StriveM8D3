import createError from 'http-errors'
import atob from 'atob'
import AuthorModel from '../services/authors/schema.js'

export const basicAuthMiddleware = async (req, res, next) => {

    if (!req.headers.authorization) {
        next (createError(401, "Please provide credentials in the Authorization header!"))
    } else {
        const credentialsDecoded = atob(req.headers.authorization.split(" ")[1])

        const [ email, password] = credentialsDecoded.split(":")

        const author = await AuthorModel.checkCredentials(email, password)

        if (author) {
            req.author = author
            next()
        } else {
            next(createError(401, "Credentials are not correct!"))
        }
    }
}