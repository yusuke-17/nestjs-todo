import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  todo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TodosService', () => {
  let todosService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      prismaService.todo.findMany.mockResolvedValue([]);
      const expected = [];
      const result = await todosService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const todo: Todo = {
        id: '1',
        title: 'test',
        description: 'test',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '1',
      };

      prismaService.todo.findUnique.mockResolvedValue(todo);
      const result = await todosService.findById('1');
      expect(result).toEqual(todo);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('異常系: 商品がない', async () => {
      prismaService.todo.findUnique.mockResolvedValue(null);
      await expect(todosService.findById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const userId = '1';

      const todo: Todo = {
        id: '1',
        title: 'test',
        description: 'test',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId,
      };

      const expected = {
        id: '1',
        title: todo.title,
        description: todo.description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId,
      };

      prismaService.todo.create.mockResolvedValue(expected);

      const result = await todosService.create(todo, userId);
      expect(result).toEqual(expected);

      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: {
          title: todo.title,
          description: todo.description,
          completed: false,
          userId,
        },
      });
    });
  });

  describe('update', () => {
    it('正常系', async () => {
      const id = '1';
      const updateTodoDto = {
        title: 'test3',
        completed: true,
      };

      const expected = {
        id: id,
        title: 'test3',
        description: 'test',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '1',
      };

      prismaService.todo.update.mockResolvedValue(expected);

      const result = await todosService.update(id, updateTodoDto);
      expect(result).toEqual(expected);

      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: id },
        data: updateTodoDto,
      });
    });
  });

  describe('delete', () => {
    it('正常系', async () => {
      const id = '1';
      const userId = '1';
      await todosService.delete(id, userId);
      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: id, userId },
      });
    });
  });
});
