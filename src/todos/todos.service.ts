import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Todo[]> {
    return await this.prismaService.todo.findMany();
  }

  async findById(id: string): Promise<Todo> {
    const found = await this.prismaService.todo.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return found;
  }

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const { title, description } = createTodoDto;
    return await this.prismaService.todo.create({
      data: {
        title,
        description,
        completed: false,
        userId: userId,
      },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const { title, description, completed } = updateTodoDto;
    return await this.prismaService.todo.update({
      where: { id },
      data: { title, description, completed },
    });
  }

  async delete(id: string, userId: string) {
    await this.prismaService.todo.delete({ where: { id, userId } });
  }
}
