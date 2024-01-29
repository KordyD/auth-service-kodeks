import { NextFunction, Request, Response } from 'express';
import groupsService from '../services/groups.service';
import { validationResult } from 'express-validator';
import { APIError } from '../errors';

class groupsController {
  constructor() {}
  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groupsData = await groupsService.getGroups();
      res.json(groupsData);
    } catch (error) {
      next(error);
    }
  }
  async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData = await groupsService.getGroup(
        Number(req.params.groupId)
      );
      res.json(groupData);
    } catch (error) {
      next(error);
    }
  }
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw APIError.BadRequestError(result.array()[0].msg, result.array());
      }
      const groupData = await groupsService.createGroup(req.body);
      res.json(groupData);
    } catch (error) {
      next(error);
    }
  }
  async editGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData = await groupsService.editGroup(
        Number(req.params.groupId),
        req.body
      );
      res.json(groupData);
    } catch (error) {
      next(error);
    }
  }
  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groupData = await groupsService.deleteGroup(
        Number(req.params.groupId)
      );
      res.json(groupData);
    } catch (error) {
      next(error);
    }
  }
}

export default new groupsController();
