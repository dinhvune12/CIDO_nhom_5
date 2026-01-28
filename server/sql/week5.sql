-- WEEK 5: appointments + appointment chat (NO BOOKING)
-- Run this after importing schema.sql
-- Database: foodbook


CREATE TABLE IF NOT EXISTS appointments (
  id INT NOT NULL AUTO_INCREMENT,
  creator_id INT NOT NULL,
  restaurant_id INT DEFAULT NULL,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(800) DEFAULT NULL,
  meeting_time DATETIME NOT NULL,
  max_participants INT DEFAULT NULL,
  status ENUM('open','closed','cancelled') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointments_creator (creator_id),
  KEY idx_appointments_restaurant (restaurant_id),
  CONSTRAINT fk_appointments_creator FOREIGN KEY (creator_id) REFERENCES users(id),
  CONSTRAINT fk_appointments_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointment_participants (
  appointment_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (appointment_id, user_id),
  KEY idx_ap_participants_user (user_id),
  CONSTRAINT fk_ap_participants_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  CONSTRAINT fk_ap_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointment_messages (
  id INT NOT NULL AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ap_messages_appointment (appointment_id),
  KEY idx_ap_messages_user (user_id),
  CONSTRAINT fk_ap_messages_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  CONSTRAINT fk_ap_messages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
