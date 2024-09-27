-- CREATE_TABLE_REQUESTS
CREATE TABLE IF NOT EXISTS Requests (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100),
  status VARCHAR(30),
  image_caption VARCHAR(500),
  new_image_url VARCHAR(500),
  CONSTRAINT status CHECK (status IN ('pending', 'failure', 'ready', 'done'))
);

-- INSERT_REQUEST
INSERT INTO Requests (email,status) VALUES ($1,'pending') RETURNING id;

-- GET_STATUS
SELECT status 
FROM Requests
where id = $1;

-- UPDATE_IMAGE_CAPTION
UPDATE Requests
SET image_caption = $2,status = 'ready'
WHERE id = $1;

-- UPDATE_IMAGE_URL
UPDATE Requests
SET new_image_url = $2,status = 'done'
WHERE id = $1;

-- GET_READY_REQUESTS
SELECT id,email,image_caption
FROM Requests
where status = 'ready';

-- TEST_DB
-- SELECT * from Requests where id = 175;
--delete from Requests;


