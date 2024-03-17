import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Messages1710451533541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'room_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'type',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'int',
            default: 0,
          },
          {
            name: 'deleted_flg',
            type: 'int',
            default: 0,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
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
      'messages',
      new TableIndex({
        name: 'IDX_ROOM_ID_DELETED_FLG',
        columnNames: ['room_id', 'deleted_flg'],
      }),
    );

    await queryRunner.createIndex(
      'messages',
      new TableIndex({
        name: 'IDX_USER_ID_DELETED_FLG',
        columnNames: ['user_id', 'deleted_flg'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('messages', 'IDX_ROOM_ID_DELETED_FLG');
    await queryRunner.dropIndex('messages', 'IDX_USER_ID_DELETED_FLG');
    await queryRunner.dropTable('messages');
  }
}
