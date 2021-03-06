import {AsyncIterator, TransformIterator, TransformIteratorOptions} from "asynciterator";

/**
 * A {@link TransformIterator} that allows the source to be set through a lazy Promise.
 * The provided getter will only be called from the moment that this proxy iterator is being read.
 *
 * Rejections of the promise will be emitted as error event.
 */
export class PromiseProxyIterator<T> extends TransformIterator<T, T> {

  protected readonly sourceGetter: () => Promise<AsyncIterator<T>>;

  constructor(sourceGetter: () => Promise<AsyncIterator<T>>, options?: TransformIteratorOptions<T>) {
    super(options || { autoStart: false });
    this.sourceGetter = sourceGetter;
  }

  public async loadSource(): Promise<AsyncIterator<T>> {
    if (!this.source) {
      this.source = await this.sourceGetter();
    }
    return this.source;
  }

  public _read(count: number, done: () => void): void {
    if (!this.source) {
      this.loadSource().then((source: AsyncIterator<T>) => {
        super._read(count, done);
      }).catch((error) => this.emit('error', error));
    } else {
      super._read(count, done);
    }
  }

}
