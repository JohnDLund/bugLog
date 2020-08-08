import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class NotesService {
  async create(body) {
    return await dbContext.Notes.create(body)
  }
  async getById(id) {
    let data = await dbContext.Notes.find({ boardId: id })
    if (!data) {
      throw new BadRequest("")
    }
    return data
  }
  async editNote(id, body) {
    return await dbContext.Notes.findByIdAndUpdate(id, body, { new: true })
  }
  async deleteList(id) {
    return await dbContext.Notes.findOneAndRemove({ _id: id })
  }
  async find(query = {}) {
    let notes = await dbContext.Notes.find(query);
    return notes;
  }
  async findById(id) {
    let value = await dbContext.Notes.findById(id);
    if (!value) {
      throw new BadRequest("Invalid Id");
    }
    return value;
  }

}

export const notesService = new NotesService();