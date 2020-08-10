import express from "express";
import BaseController from "../utils/BaseController";
import { notesService } from "../services/NotesService";
import auth0provider from "@bcwdev/auth0provider";


export class NotesController extends BaseController {
  constructor() {
    super("api/notes");
    this.router
      .use(auth0provider.isAuthorized)
      .get("", this.getAll)
      .get("/:id/notes", this.getBugsByNoteId)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .post("", this.create)
      .put("/:id", this.editNote)
      .delete("/:id", this.deleteNote)
  }

  async getAll(req, res, next) {
    try {
      let notes = await notesService.find()
      res.send({ data: notes, message: "got the notes" })
    } catch (error) {
      next(error);
    }
  }
  async getBugsByNoteId(req, res, next) {
    try {
      let data = await notesService.getById(req.params.id)
      return res.send(data)
    } catch (error) { next(error) }
  }
  async create(req, res, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      req.body.creatorId = req.user.sub;
      let data = await notesService.create(req.body)
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async editNote(req, res, next) {
    try {
      let note = await notesService.editNote(req.params.id, req.body)
      res.send({ data: note, message: "Edited" })
    } catch (error) {
      console.error(error);
    }
  }
  async deleteNote(req, res, next) {
    try {
      await notesService.deleteNote(req.params.id)
      res.send("Deleted")
    } catch (error) {
      console.error(error);
    }
  }
}
