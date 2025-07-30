declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInstanceOf(constructor: any): R;
    }
  }
  
  var fetch: jest.Mock;
}

export {}; 