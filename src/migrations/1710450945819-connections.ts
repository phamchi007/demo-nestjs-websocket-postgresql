import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Connections1710450945819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'connections',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'connection_id',
            type: 'varchar',
          },
          {
            name: 'domain_name',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'disconnected_at',
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
      'connections',
      new TableIndex({
        name: 'IDX_USER_ID_STATUS',
        columnNames: ['user_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'connections',
      new TableIndex({
        name: 'IDX_CONNECTION_ID',
        columnNames: ['connection_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('connections', 'IDX_USER_ID_STATUS');
    await queryRunner.dropIndex('connections', 'IDX_CONNECTION_ID');
    await queryRunner.dropTable('connections');
  }
}
