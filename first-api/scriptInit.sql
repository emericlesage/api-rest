CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES
    ('Client'),
    ('Manager'),
    ('Administrateur')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 1 REFERENCES roles(id)
);

INSERT INTO users (firstname, lastname, email, password, role_id)
SELECT 'John', 'Doe', 'john.doe@mail.com',
       '$2b$10$8JsEgqXH5KsIIqqBVYtzj.03z6Rzz/JbV6l4QcX/q2iLPCovJAbAu',
       roles.id
FROM roles
WHERE roles.name = 'Manager'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (firstname, lastname, email, password, role_id)
SELECT 'Jane', 'Doe', 'jane.doe@mail.com',
       '$2b$10$8JsEgqXH5KsIIqqBVYtzj.03z6Rzz/JbV6l4QcX/q2iLPCovJAbAu',
       roles.id
FROM roles
WHERE roles.name = 'Administrateur'
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    owner INTEGER REFERENCES users(id)
);

INSERT INTO products (name, description, price, category, owner)
SELECT seed.name, seed.description, seed.price, seed.category, users.id
FROM (VALUES
    ('Clavier mécanique', 'Clavier USB avec switches tactiles', 79.99, 'Informatique', 'john.doe@mail.com'),
    ('Souris sans fil', 'Souris optique sans fil avec récepteur USB', 24.50, 'Informatique', 'john.doe@mail.com'),
    ('Écran 24 pouces', 'Écran Full HD 1920 x 1080', 149.90, 'Informatique', 'jane.doe@mail.com'),
    ('Casque audio', 'Casque stéréo avec microphone intégré', 59.00, 'Audio', 'john.doe@mail.com'),
    ('Enceinte Bluetooth', 'Enceinte portable rechargeable', 39.99, 'Audio', 'john.doe@mail.com'),
    ('Bouteille isotherme', 'Bouteille en acier inoxydable, 750 ml', 18.75, 'Accessoires', 'john.doe@mail.com'),
    ('Sac à dos', 'Sac à dos résistant avec compartiment pour ordinateur', 44.90, 'Accessoires', 'john.doe@mail.com'),
    ('Lampe de bureau', 'Lampe LED à intensité réglable', 32.00, 'Maison', 'john.doe@mail.com')
) AS seed(name, description, price, category, email)
JOIN users ON users.email = seed.email
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE products.name = seed.name
);
