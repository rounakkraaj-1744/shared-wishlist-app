# Shared Wishlist App

A modern, full-stack web application that allows users to create and share wishlists with others. This project was developed as part of a full-stack development internship task.

---

## ✨ Features

* User Authentication (Sign up, Login)
* User Dashboard
* Create and manage personal wishlists
* View other users' public wishlists
* Sleek, stylish, and responsive UI

---

## 👨‍💻 Tech Stack Used

### Frontend:

* **Next.js** (App Router)
* **TypeScript**
* **Tailwind CSS**
* **ShadCN UI** (for modern UI components)

### Backend:

* **Next.js API Routes** (or optionally, a separate server using **Nest.js**)
* **Express.js along with TypeScript**
* **Prisma ORM**
* **PostgreSQL**
* **NextAuth** (for authentication)

### Other:

* **Axios** for API calls
* **React Hook Form + Zod** for form validation

---

## 📅 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rounakkraaj-1744/shared-wishlist-app.git
cd shared-wishlist-app
```

### 2. Install Dependencies

```bash
cd client
npm install # or npm install or pnpm install or bun install

cd server
npm install # or npm install or pnpm install or bun install
```

### 4. Go to the client's directory

```bash
npm run dev # to start the frontend server
```

### 5. Go to the server's directory

```bash
docker compose up -d # to pull the postgres image
npx prisma migrate dev --name init # to create the migrations.sql file
npx prisma generate

# to show the database in tabular form run -> npx prisma studio

npm run dev # to start the frontend server
```


Visit `http://localhost:3000` to use the app.

---

## ⚠️ Assumptions & Limitations

* Only authenticated users can create and share wishlists.
* All wishlists are public by default; private wishlist support is not implemented.
* User search or friend requests are not part of the MVP.
* Mobile responsiveness is supported but not fully optimized for all screen sizes.
* No email notifications or invitation links currently implemented.

---

## 📈 Future Improvements

* Add wishlist privacy controls
* User search and collaboration features
* Mobile app version (React Native)
* Richer media support for wishlist items (images, links)

---

## ✍️ Author

Made with ❤️ by \[Rounakk Raaj Sabat].

---