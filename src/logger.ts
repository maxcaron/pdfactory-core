export const logger = {
  debug: (message: any) => {
    if (process.env.DEBUG) {
      console.log('DEBUG');
      console.log(message);
    }
  },
};