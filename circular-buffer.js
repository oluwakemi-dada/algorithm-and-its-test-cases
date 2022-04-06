class CircularBuffer {
  constructor(bufferSize, next = 0) {
    this.buffer = new Array(bufferSize).fill(null);
    this.size = 0;
    this.first = undefined;
    this.next = next;
  }

  write(value) {
    if (value === null || value === undefined) throw new NotValidBuffer();
    if (this.size >= this.buffer.length) throw new BufferFullError();
    else {
      this.buffer[this.next] = value;
      if (this.first === undefined) this.first = this.next;
      this.next = (this.next + 1) % this.buffer.length;
      this.size++;
    }
  }

  read() {
    if (this.size == 0) throw new BufferEmptyError();
    else {
      let temp = this.buffer[this.first];
      this.buffer[this.first] = null;
      this.first = (this.first + 1) % this.buffer.length;
      this.size--;
      return temp;
    }
  }

  forceWrite(value) {
    if (value === null || value === undefined) throw new NotValidBuffer();
    if (this.size < this.buffer.length) return this.write(value);
    else {
      this.buffer[this.first] = value;
      this.first = (this.first + 1) % this.buffer.length;
      this.next = this.first;
    }
  }

  clear() {
    for (let x = 0; x < this.buffer.length; x++) {
      this.buffer[x] = null;
    }
    this.size = 0;
    this.first = undefined;
    this.next = 0;
  }

  print() {
    return this.buffer;
  }
}

export default CircularBuffer;

export class BufferFullError extends Error {
  constructor() {
    super(
      'Buffer is full, further writes are blocked until a slot becomes free'
    );
    this.name = 'BufferFullError';
  }
}

export class BufferEmptyError extends Error {
  constructor() {
    super('Buffer is empty');
    this.name = 'BufferEmptyErr';
  }
}

export class NotValidBuffer extends Error {
  constructor() {
    super('Invalid buffer! null or undefined not allowed');
    this.name = 'NotValidBuffer';
  }
}