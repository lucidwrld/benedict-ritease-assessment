/** @type {import('next').NextConfig} */
export default {
  webpack: (config) => {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      return config;
  },
};
