const { DataTypes, QueryTypes } = require('sequelize');

async function ensureSongSchema(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable('songs');

    const newColumns = {
        languages: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        other_languages: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        mood_tags: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        raw_lyrics: { type: DataTypes.TEXT, allowNull: true },
        cover_image_url: { type: DataTypes.TEXT, allowNull: true },
        cover_image_public_id: { type: DataTypes.STRING, allowNull: true },
        audio_url: { type: DataTypes.TEXT, allowNull: true },
        audio_public_id: { type: DataTypes.STRING, allowNull: true },
        source_youtube_url: { type: DataTypes.TEXT, allowNull: true },
        video_url: { type: DataTypes.TEXT, allowNull: true },
        video_public_id: { type: DataTypes.STRING, allowNull: true },
        duration_secs: { type: DataTypes.INTEGER, allowNull: true }
    };

    for (const [colName, colDef] of Object.entries(newColumns)) {
        if (!columns[colName]) {
            await queryInterface.addColumn('songs', colName, colDef);
        }
    }
}

async function ensureGenerationJobSchema(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable('generation_jobs');

    if (!columns.started_at) {
        await queryInterface.addColumn('generation_jobs', 'started_at', {
            type: DataTypes.DATE,
            allowNull: true
        });
    }

    if (!columns.completed_at) {
        await queryInterface.addColumn('generation_jobs', 'completed_at', {
            type: DataTypes.DATE,
            allowNull: true
        });
    }
}

async function ensureGuestReflectionSchema(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable('reflections');

    if (!columns.display_mode) {
        await queryInterface.addColumn('reflections', 'display_mode', {
            allowNull: false,
            defaultValue: 'ANONYMOUS',
            type: DataTypes.STRING(32),
        });
    }

    if (!columns.guest_submission) {
        await queryInterface.addColumn('reflections', 'guest_submission', {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        });
    }

    await sequelize.query(
        "UPDATE reflections SET display_mode = CASE WHEN display_name IS NULL THEN 'ANONYMOUS' ELSE 'PROFILE' END",
        { type: QueryTypes.UPDATE }
    );
}

async function ensureReflectionModerationSchema(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable('reflections');

    if (!columns.tags) {
        await queryInterface.addColumn('reflections', 'tags', {
            allowNull: false,
            defaultValue: [],
            type: DataTypes.JSON,
        });
    }

    if (!columns.moderated_by) {
        await queryInterface.addColumn('reflections', 'moderated_by', {
            allowNull: true,
            onDelete: 'SET NULL',
            references: { key: 'id', model: 'users' },
            type: DataTypes.UUID,
        });
    }

    if (!columns.moderated_at) {
        await queryInterface.addColumn('reflections', 'moderated_at', {
            allowNull: true,
            type: DataTypes.DATE,
        });
    }

    if (!columns.moderator_note) {
        await queryInterface.addColumn('reflections', 'moderator_note', {
            allowNull: true,
            type: DataTypes.TEXT,
        });
    }

    const indexes = await queryInterface.showIndex('reflections');
    if (!indexes.some((index) => index.name === 'reflections_status_created_at_idx')) {
        await queryInterface.addIndex('reflections', ['status', 'created_at'], {
            name: 'reflections_status_created_at_idx',
        });
    }
}

module.exports = { ensureGuestReflectionSchema, ensureReflectionModerationSchema, ensureSongSchema, ensureGenerationJobSchema };
