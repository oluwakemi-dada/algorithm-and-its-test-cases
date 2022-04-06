class CircularBuffer {
  constructor(bufferSize, next = 0) {
    this.buffer = new Array(bufferSize).fill(null);
    this.size = 0;
    this.first = undefined;
    this.next = next;
  }

  write(value) {
    if (value === null || value === undefined) return;
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
    if (value === null || value === undefined) return;
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
    console.log(this.buffer);
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
  constructor(message) {
    super(message);
    this.name = 'NotValidBuffer';
  }
}

// const cb = new CircularBuffer(5, 3);
// // cb.write(10);
// // cb.write(20);
// // cb.write(30);
// // cb.write(40);
// // cb.write(50);
// // cb.forceWrite(60);
// // cb.read();
// // cb.forceWrite(70);
// // cb.forceWrite(80);
// // cb.write(90);
// // cb.clear();

// cb.print();
