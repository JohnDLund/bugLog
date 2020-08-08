import { dbContext } from "../db/DbContext"
import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

const note = new Schema({
  content: { type: String, required: true },
  bug: { type: ObjectId, ref: 'Bug', required: true },
  flagged: { type: String, enum: ["pending", "completed", "rejected"] },
  creatorEmail: { type: String, required: true }
}, { timestamps: true, toJSON: { virtuals: true } })


note.virtual("creator",
  {
    localField: "creatorEmail",
    ref: "Profile",
    foreignField: "email",
    justOne: true
  })

// //CASCADE ON DELETE
// note.pre('deleteMany', function (next) {
//   //lets find all the notes and remove them
//   Promise.all([
//     //something like...
//     dbContext.Task.deleteMany({ noteId: this._conditions._id }),
//   ])
//     .then(() => next())
//     .catch(err => next(err))
// })

// //CASCADE ON DELETE
// note.pre('findOneAndRemove', function (next) {
//   //lets find all the notes and remove them
//   Promise.all([
//     dbContext.Task.deleteMany({ noteId: this._conditions._id })
//   ])
//     .then(() => next())
//     .catch(err => next(err))

// })

export default note