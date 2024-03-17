import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Rooms1710451414823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rooms',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'room_name',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'int',
            default: 0,
          },
          {
            name: 'deleted_flg',
            type: 'int',
            default: 0,
          },
          {
            name: 'user_created',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'rooms',
      new TableIndex({
        name: 'IDX_ROOM_NAME_TYPE_USER_CREATE',
        columnNames: ['room_name', 'type', 'user_created', 'deleted_flg'],
      }),
    );

    await queryRunner.createIndex(
      'rooms',
      new TableIndex({
        name: 'IDX_USER_CREATED_STATUS_TYPE',
        columnNames: ['user_created', 'type', 'deleted_flg'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'rooms',
      'IDX_ROOM_NAME_STATUS_TYPE_USER_CREATE',
    );
    await queryRunner.dropIndex('rooms', 'IDX_USER_CREATED_STATUS_TYPE');
    await queryRunner.dropTable('rooms');
  }
}
