import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1630832657039 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE public.product (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        price SMALLINT CONSTRAINT positive_price CHECK (price > 0),
        "createdAt" timestamptz DEFAULT now(),
        "updatedAt" timestamptz DEFAULT now()
      );
      CREATE TABLE public.stock (
        "productId" uuid PRIMARY KEY,
        count SMALLINT,
        "createdAt" timestamptz DEFAULT now(),
        "updatedAt" timestamptz DEFAULT now(),
        FOREIGN KEY ("productId") REFERENCES public.product("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      INSERT INTO public.product (id,title,description,price) VALUES
        ('df4806d9-e3f6-4c2c-8776-3c3d568c3883','капуста','описание капусточки',12),
        ('44eec697-7fd6-4fa3-8f34-3243e711d722','мокровь','описание морковочки',100);
      INSERT INTO public.stock ("productId",count) VALUES
        ('df4806d9-e3f6-4c2c-8776-3c3d568c3883',10),
        ('44eec697-7fd6-4fa3-8f34-3243e711d722',45);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS public.stock;
      DROP TABLE IF EXISTS public.product;
    `);
  }
  
}
