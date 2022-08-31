export default {
  collectCoverageFrom: ["src/**/*.js"],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
};

