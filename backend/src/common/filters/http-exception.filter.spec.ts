import { BadRequestException, Controller, Get, INestApplication, Post, Body, Module } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app';
import { PrismaService } from '../../prisma/prisma.service';

class SampleBodyDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name!: string;
}

@Controller('sample')
class SampleController {
  @Get('ok')
  ok() {
    return { ok: true };
  }

  @Post('validate')
  validate(@Body() body: SampleBodyDto) {
    return body;
  }
}

@Module({ controllers: [SampleController] })
class SampleModule {}

describe('API foundation (validation + errors)', () => {
  let app: INestApplication;

  const prismaMock = {
    ping: jest.fn().mockResolvedValue(true),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SampleModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns consistent shape for validation errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/sample/validate')
      .send({ email: 'not-an-email', name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      path: '/api/v1/sample/validate',
    });
    expect(response.body.message).toBeDefined();
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('strips unknown properties when validation passes', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/sample/validate')
      .send({
        email: 'user@example.com',
        name: 'Ada',
        extraField: 'removed',
      })
      .expect(201);

    expect(response.body).toEqual({
      email: 'user@example.com',
      name: 'Ada',
    });
  });

  it('returns consistent shape for not found', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/does-not-exist').expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      path: '/api/v1/does-not-exist',
    });
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
