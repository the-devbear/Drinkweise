BEGIN;

INSERT INTO
    "auth"."users" (
        "instance_id",
        "id",
        "aud",
        "role",
        "email",
        "encrypted_password",
        "raw_app_meta_data",
        "raw_user_meta_data",
        "email_confirmed_at",
        "recovery_sent_at",
        "last_sign_in_at",
        "created_at",
        "updated_at",
        "confirmation_token",
        "email_change",
        "email_change_token_new",
        "recovery_token"
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        '7c4c76a3-6a28-41b8-a785-c70e88f2b69a',
        'authenticated',
        'authenticated',
        't@t.de',
        crypt ('password', gen_salt ('bf')),
        '{"provider": "email", "providers": ["email"]}',
        '{"sub": "7c4c76a3-6a28-41b8-a785-c70e88f2b69a", "email": "t@t.de", "email_verified": true, "phone_verified": false}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        '',
        '',
        '',
        ''
    );

INSERT INTO
    auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        SELECT
            uuid_generate_v4 (),
            id,
            id,
            FORMAT(
                '{"sub":"%s","email":"%s"}',
                id::TEXT,
                email
            )::jsonb,
            'email',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        FROM auth.users
    );

INSERT INTO
    "public"."users" (
        "id",
        "username",
        "profile_picture",
        "height",
        "weight",
        "gender",
        "has_completed_onboarding",
        "created_at"
    )
VALUES (
        '7c4c76a3-6a28-41b8-a785-c70e88f2b69a',
        'devbear',
        NULL,
        187,
        61.5,
        'male',
        TRUE,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO
UPDATE
SET
    username = excluded.username,
    HEIGHT = excluded.height,
    weight = excluded.weight,
    gender = excluded.gender,
    has_completed_onboarding = excluded.has_completed_onboarding;

COMMIT;