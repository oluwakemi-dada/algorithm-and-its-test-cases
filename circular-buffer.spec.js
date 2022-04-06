import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
} from './circular-buffer';

describe('CircularBuffer', () => {
  test('should show error message when reading an empty buffer', () => {
    const buffer = new CircularBuffer(3);
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('should show error message once buffer is full', () => {
    const buffer = new CircularBuffer(3);
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(() => buffer.write('40')).toThrow(new BufferFullError());
  });

  test('should write to buffer and read an item just written', () => {
    const buffer = new CircularBuffer(3);
    buffer.write('10');
    expect(buffer.read()).toBe('10');
  });

  test('should write to buffer multiple times and read from oldest item', function () {
    const buffer = new CircularBuffer(5);
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(buffer.read()).toBe('10');
    expect(buffer.read()).toBe('20');
    buffer.write('40');
    buffer.write('50');
    expect(buffer.read()).toBe('30');
    expect(buffer.read()).toBe('40');
    expect(buffer.read()).toBe('50');
  });

  test('should clear a buffer and throw an error when read is called afterwards', function () {
    const buffer = new CircularBuffer(3);
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    buffer.clear();
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('should write to buffer at a certain position', function () {
    const buffer = new CircularBuffer(5, 2);
    buffer.write('10');
    const arr = buffer.print();
    expect(arr).toEqual([null, null, '10', null, null]);
  });
});
