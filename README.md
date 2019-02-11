## "Tìm ở ghép, phòng trọ, bạn trọ" App

Running web app by Firebase Hosting: https://fhouse-app.firebaseapp.com/

### Javascript Stack:

- `React`
  - Webpack, Babel build script
- `React Native` with `Expo` SDK
  - Native Base UI Component
- `Firebase` Ecosystem
  - Realtime Database (real-time sync)
  - Authentication
  - Cloud Function (Serverless)

![Firebase](https://cdn-images-1.medium.com/max/1600/1*QQp2cY4gTH5BQcbXmGVYbQ.png)

### Environment:

Assuming you have a working Node.js environment (with `npm` dependency management).

### Set-up

Fetch all dependencies of `npm`:

```
$ npm install
```

### Development

Develop Expo with hot reload:

```
npm run start
```

Develop web app:

```
npm run web
```

**Recommended use with VSCode and ESLint installed.**
