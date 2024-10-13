import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from '../types/requestUser';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return await this.todosService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Todo> {
    return await this.todosService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() CreateTodoDto: CreateTodoDto,
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<Todo> {
    return await this.todosService.create(CreateTodoDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateCompleted(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest & { user: RequestUser },
  ) {
    return await this.todosService.delete(id, req.user.id);
  }
}
