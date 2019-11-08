import {AsyncIterator} from "asynciterator";
import {PromiseProxyIterator} from "../lib/PromiseProxyIterator";

describe('PromiseProxyIterator', () => {
  describe('The PromiseProxyIterator module', () => {
    it('should be a function', () => {
      expect(PromiseProxyIterator).toBeInstanceOf(Function);
    });

    it('should be a PromiseProxyIterator constructor', () => {
      expect(new PromiseProxyIterator(() => Promise.resolve(AsyncIterator.range(0, 10))))
        .toBeInstanceOf(PromiseProxyIterator);
    });
  });

  describe('A PromiseProxyIterator instance', () => {
    let iterator: PromiseProxyIterator<number>;
    let called: number;

    beforeEach(() => {
      called = 0;
      iterator = new PromiseProxyIterator(() => new Promise((resolve, reject) => {
        ++called;
        resolve(AsyncIterator.range(0, 10));
      }));
    });

    it('should not create the source before the proxy is called', () => {
      return expect(called).toBeFalsy();
    });

    it('should create the source when the loadSource function is called', async () => {
      await iterator.loadSource();
      expect(called).toBeTruthy();
    });

    it('should return the source when calling loadSource for the second time', async () => {
      const source1 = await iterator.loadSource();
      const source2 = await iterator.loadSource();
      expect(called).toBe(1);
      expect(source1).toBe(source2);
    });

    it('should create the source when the proxy is called', () => {
      return expect(new Promise((resolve, reject) => {
        iterator.on('data', () => {
          resolve(called);
        });
      })).resolves.toBeTruthy();
    });

    it('should emit an error on promise rejection', () => {
      return new Promise((resolve, reject) => {
        iterator = new PromiseProxyIterator(() => Promise.reject(new Error('This should be caught')));
        iterator.on('error', () => resolve());
        iterator.on('data', () => { return; });
      });
    });
  });
});
