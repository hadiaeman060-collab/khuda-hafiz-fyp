import 'dotenv/config';

export default {
  expo: {
    name: "KhudaHafiz",
    slug: "khuda-hafiz",
    version: "1.0.0",
    owner: "muhib-using-expos-organization",
    icon: "./assets/images/icon.png",
    android: {
      package: "com.khudahafiz.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "1b3f4942-211a-4862-96c2-e21a3f6c34ac",
      },
    },
  },
};
