-- Saved questions now belong to a user and remember their book and chapter.
ALTER TABLE genquestions
  ADD COLUMN user_id INT NULL,
  ADD COLUMN book_title VARCHAR(255) NULL,
  ADD COLUMN chapter VARCHAR(255) NULL;
