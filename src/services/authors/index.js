import express from 'express'
import AuthorModel from './schema.js'
import createError from 'http-errors'
import { basicAuthMiddleware } from '../../auth/basic.js'

const authorsRouter = express.Router()

// ===============  CREATES NEW AUTHOR =======================
authorsRouter.post('/register', async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const { _id } = await newAuthor.save()

        res.status(201).send({ _id })

    } catch (error) {
        console.log(error.name);
        if(error.name === "ValidationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating a new author"))
        }
    }
})

// ===============  RETURNS AUTHORS LIST =======================
authorsRouter.get('/', basicAuthMiddleware, async (req, res, next) => {
    try {
        const authors = await AuthorModel.find()
        res.send(authors)
    } catch (error) {
        next(createError(500, "An Error ocurred while getting the list of authors"))
    }
})

// ===============  RETURNS SINGLE AUTHOR =======================
authorsRouter.get('/me', basicAuthMiddleware, async (req, res, next) => {
    try {
        res.send(req.author)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get('/:authorId', basicAuthMiddleware, async (req, res, next) => {
    try {
        const authorId = req.params.authorId
        const author = await AuthorModel.findById(authorId)

        if(author) {
            res.send(author)
        } else {
            next(createError(404, `author with _id ${authorId} Not Found!`))
        }
    } catch (error) {
        next(createError(500, "An Error ocurred while getting the author"))
    }
})


// ===============  UPDATES AN AUTHOR =======================

authorsRouter.put('/me', basicAuthMiddleware, async (req, res, next) => {
    try {
        const updatedAuthor = await req.author.updateOne(req.body)
        res.send(updatedAuthor)
    } catch (error) {
        next(error)
    }
})

// authorsRouter.put('/:authorId', async (req, res, next) => {
//     try {
//         const authorId = req.params.authorId
//         const modifiedAuthor = await AuthorModel.findByIdAndUpdate(authorId, req.body, {
//             new: true,
//             runValidators: true,
//         })

//         if(modifiedAuthor) {
//             res.send(modifiedAuthor)
//         } else {
//             next(createError(404, `Author with _id ${authorId} Not Found!`))
//         }
//     } catch (error) {
//         next(createError(500, `An Error ocurred while updating the author ${req.params.authorId}`))
//     }
// })

// ===============  DELETES AN AUTHOR =======================
authorsRouter.delete('/me', basicAuthMiddleware, async (req, res, next) => {
    try {
        await req.author.deleteOne()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

// authorsRouter.delete('/:authorId', async (req, res, next) => {
//     try {
//         const authorId = req.params.authorId
//         const deletedAuthor = await AuthorModel.findByIdAndDelete(authorId)

//         if (deletedAuthor) {
//             res.status(204).send()
//         } else {
//             next(createError(404, `Author with _id ${authorId} Not Found!`))
//         }
//     } catch (error) {
//         next(createError(500, `An Error ocurred while deleting the author ${req.params.authorId}`))
//     }
// })


export default authorsRouter