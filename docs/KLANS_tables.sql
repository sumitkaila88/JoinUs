SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- -------------------------
-- 2.1 users (must be first)
-- -------------------------
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(120),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(150),
    avatar_url TEXT,
    gender VARCHAR(20),
    dob DATE,
    bio TEXT,
    last_login_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 2.2 community
-- -------------------------
CREATE TABLE community (
    community_id CHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    location JSON,
    created_by_user_id CHAR(36) NOT NULL,
    cover_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_community_creator
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_community_created_by ON community(created_by_user_id);

-- -------------------------
-- 2.3 member
-- -------------------------
CREATE TABLE member (
    member_id CHAR(36) PRIMARY KEY,
    community_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('member', 'moderator', 'admin') DEFAULT 'member',
    status ENUM('active', 'left', 'banned') DEFAULT 'active',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP NULL,

    CONSTRAINT fk_member_community
        FOREIGN KEY (community_id) REFERENCES community(community_id),
    CONSTRAINT fk_member_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_member_comm ON member(community_id);
CREATE INDEX idx_member_user ON member(user_id);

-- -------------------------
-- 2.4 post
-- -------------------------
CREATE TABLE post (
    post_id CHAR(36) PRIMARY KEY,
    community_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    content_text TEXT,
    media_count INT DEFAULT 0,
    is_poll BOOLEAN DEFAULT FALSE,
    is_event BOOLEAN DEFAULT FALSE,
    visibility ENUM('public','members') DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_community
        FOREIGN KEY (community_id) REFERENCES community(community_id),
    CONSTRAINT fk_post_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_post_comm ON post(community_id);
CREATE INDEX idx_post_user ON post(user_id);

-- -------------------------
-- 2.5 event
-- -------------------------
CREATE TABLE event (
    event_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    community_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(150),
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    venue VARCHAR(255),
    location JSON,
    max_capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_post
        FOREIGN KEY (post_id) REFERENCES post(post_id),
    CONSTRAINT fk_event_community
        FOREIGN KEY (community_id) REFERENCES community(community_id),
    CONSTRAINT fk_event_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_event_post ON event(post_id);
CREATE INDEX idx_event_comm ON event(community_id);
CREATE INDEX idx_event_user ON event(user_id);

-- ============================================================
-- 3. EXTENDED CONTENT TABLES
-- ============================================================

-- -------------------------
-- 3.1 comment
-- -------------------------
CREATE TABLE comment (
    comment_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    parent_comment_id CHAR(36) NULL,
    text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_post
        FOREIGN KEY (post_id) REFERENCES post(post_id),
    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_comment_parent
        FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_comment_post ON comment(post_id);
CREATE INDEX idx_comment_user ON comment(user_id);

-- -------------------------
-- 3.2 reaction
-- -------------------------
CREATE TABLE reaction (
    reaction_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    type ENUM('like','love','laugh','sad','angry') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_reaction (post_id, user_id, type),

    CONSTRAINT fk_reaction_post
        FOREIGN KEY (post_id) REFERENCES post(post_id),
    CONSTRAINT fk_reaction_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 3.3 media
-- -------------------------
CREATE TABLE media (
    media_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36),
    user_id CHAR(36),
    file_url TEXT NOT NULL,
    file_type ENUM('image','video','audio','doc'),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_media_post
        FOREIGN KEY (post_id) REFERENCES post(post_id),
    CONSTRAINT fk_media_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 3.4 poll & poll_option
-- -------------------------
CREATE TABLE poll (
    poll_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) UNIQUE NOT NULL,
    question TEXT NOT NULL,
    multiple_choice BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_poll_post
        FOREIGN KEY (post_id) REFERENCES post(post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE poll_option (
    poll_option_id CHAR(36) PRIMARY KEY,
    poll_id CHAR(36) NOT NULL,
    option_text VARCHAR(255),
    vote_count INT DEFAULT 0,

    CONSTRAINT fk_poll_option
        FOREIGN KEY (poll_id) REFERENCES poll(poll_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. SYSTEM TABLES
-- ============================================================

-- -------------------------
-- 4.1 role & permission
-- -------------------------
CREATE TABLE role (
    role_id CHAR(36) PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permission (
    permission_id CHAR(36) PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE role_permission (
    role_id CHAR(36),
    permission_id CHAR(36),

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_roleperm_role
        FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT fk_roleperm_perm
        FOREIGN KEY (permission_id) REFERENCES permission(permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 4.2 audit_log
-- -------------------------
CREATE TABLE audit_log (
    audit_log_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    action VARCHAR(100),
    entity VARCHAR(50),
    entity_id CHAR(36),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 4.3 notification
-- -------------------------
CREATE TABLE notification (
    notification_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    type VARCHAR(50),
    title VARCHAR(150),
    body TEXT,
    reference_id CHAR(36),
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 4.4 badge
-- -------------------------
CREATE TABLE badge (
    badge_id CHAR(36) PRIMARY KEY,
    name VARCHAR(80),
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_badge (
    user_badge_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    badge_id CHAR(36),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_userbadge_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_userbadge_badge
        FOREIGN KEY (badge_id) REFERENCES badge(badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. MESSAGING & REALTIME
-- ============================================================

-- -------------------------
-- 5.1 chat
-- -------------------------
CREATE TABLE chat (
    chat_id CHAR(36) PRIMARY KEY,
    type ENUM('direct','group'),
    community_id CHAR(36),
    created_by_user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chat_community
        FOREIGN KEY (community_id) REFERENCES community(community_id),
    CONSTRAINT fk_chat_user
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_chat_community ON chat(community_id);
CREATE INDEX idx_chat_user ON chat(created_by_user_id);

CREATE TABLE chat_member (
    chat_member_id CHAR(36) PRIMARY KEY,
    chat_id CHAR(36),
    user_id CHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chatmember_chat
        FOREIGN KEY (chat_id) REFERENCES chat(chat_id),
    CONSTRAINT fk_chatmember_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------
-- 5.2 message
-- -------------------------
CREATE TABLE message (
    message_id CHAR(36) PRIMARY KEY,
    chat_id CHAR(36) NOT NULL,
    sender_user_id CHAR(36) NOT NULL,
    text TEXT,
    media_url TEXT,
    reply_to_message_id CHAR(36),
    status ENUM('sent','delivered','read') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_message_chat
        FOREIGN KEY (chat_id) REFERENCES chat(chat_id),
    CONSTRAINT fk_message_user
        FOREIGN KEY (sender_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_message_reply
        FOREIGN KEY (reply_to_message_id) REFERENCES message(message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_message_chat ON message(chat_id);

-- -------------------------
-- 5.3 presence
-- -------------------------
CREATE TABLE presence (
    presence_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    status ENUM('online','offline','away') DEFAULT 'offline',
    last_seen_at TIMESTAMP,

    CONSTRAINT fk_presence_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
