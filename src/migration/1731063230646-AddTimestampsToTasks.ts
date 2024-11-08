import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToTasks1731063230646 implements MigrationInterface {
    name = 'AddTimestampsToTasks1731063230646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdAt"`);
    }

}
