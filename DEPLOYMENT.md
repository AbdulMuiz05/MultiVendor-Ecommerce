# Eshop Deployment Checklist

## Backend

Set these environment variables in the backend deployment:

- MONGODB_URI
- JWT_SECRET_KEY
- JWT_EXPIRE
- ACTIVATION_SECRET
- FRONTEND_URL
- STRIPE_SECRET_KEY
- STRIPE_API_KEY
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- SOCKET_SERVER_URL
- INTERNAL_SOCKET_SECRET

Product and event images are uploaded server-side to Cloudinary. Do not put the Cloudinary API secret in the frontend.

The backend is configured as a Vercel Node function through `backend/vercel.json`.

## Frontend

Set:

- REACT_APP_BACKEND_URL

For example, the deployed backend origin, without `/api/v1`. The frontend builds `/api/v1` automatically.

## Socket service

Socket.IO is a separate Node service and must be deployed separately from the Vercel frontend/backend function.

Set:

- SOCKET_PORT
- FRONTEND_URL
- JWT_SECRET_KEY
- INTERNAL_SOCKET_SECRET

The socket service and backend must use the same JWT secret.

The backend must also set SOCKET_SERVER_URL to the deployed socket origin and INTERNAL_SOCKET_SECRET to the same private value configured on the socket service.

Set `REACT_APP_SOCKET_URL` to the deployed socket origin.

## Production values

- FRONTEND_URL = deployed frontend origin
- REACT_APP_BACKEND_URL = deployed backend origin
- REACT_APP_SOCKET_URL = deployed socket origin
- SOCKET_SERVER_URL = deployed socket origin
- Use the same JWT_SECRET_KEY in backend and socket service
- Use the same INTERNAL_SOCKET_SECRET in backend and socket service
- Use production Stripe keys only after the complete checkout flow has been verified

## Important

Do not commit real `.env` files or API secrets. The repository contains only `.env.example` templates.
