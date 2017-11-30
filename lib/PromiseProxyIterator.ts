import {AsyncIterator, TransformIterator} from "asynciterator";

/**
 * A {@link TransformIterator} that allows the source to be set through a lazy Promise.
 * The provided getter will only be called from the moment that this proxy iterator is being read.
 *
 * Rejections of the promise will be emitted as error event.
 */
export class PromiseProxyIterator<T> extends TransformIterator<T, T> {

  protected readonly sourceGetter: () => Promise<AsyncIterator<T>>;

  constructor(sourceGetter: () => Promise<AsyncIterator<T>>) {
    super();
    this.sourceGetter = sourceGetter;
  }

  protected _begin(done: () => void) {
    this.sourceGetter().then((source: AsyncIterator<T>) => {
      this.source = source;
      done();
    }).catch((error) => this.emit('error', error));
  }

}
