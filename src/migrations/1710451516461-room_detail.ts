import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class RoomDetail1710451516461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'room_detail',
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
      'room_detail',
      new TableIndex({
        name: 'IDX_ROOM_ID_STATUS_DELETED_FLG',
        columnNames: ['room_id', 'status', 'deleted_flg'],
      }),
    );

    await queryRunner.createIndex(
      'room_detail',
      new TableIndex({
        name: 'IDX_USER_ID_STATUS_DELETED_FLG',
        columnNames: ['user_id', 'status', 'deleted_flg'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('room_detail', 'IDX_ROOM_ID_TYPE_DELETED_FLG');
    await queryRunner.dropIndex('room_detail', 'IDX_USER_ID_TYPE_DELETED_FLG');
    await queryRunner.dropTable('room_detail');
  }
}
