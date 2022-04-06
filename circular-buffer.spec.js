import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
  NotValidBuffer,
} from './circular-buffer';

describe('CircularBuffer', () => {
  test('should show error message when you read an empty buffer', () => {
    const buffer = new CircularBuffer(3);
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('should show error message when you write to a full buffer', () => {
    const buffer = new CircularBuffer(3);
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(() => buffer.write('40')).toThrow(new BufferFullError());
  });

  test('should show error message when you write null or undefined to a buffer', () => {
    const buffer = new CircularBuffer(5);
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(() => buffer.write(null)).toThrow(new NotValidBuffer());
    expect(() => buffer.write(undefined)).toThrow(new NotValidBuffer());
  });

  test('should write first item to buffer at a certain position', () => {
    const buffer = new CircularBuffer(5, 2);
    const items = buffer.print();
    buffer.write('10');
    expect(items).toEqual([null, null, '10', null, null]);
  });

  test('should write to buffer and read an item just written', () => {
    const buffer = new CircularBuffer(3);
    const items = buffer.print();
    buffer.write('10');
    expect(items).toEqual(['10', null, null]);
    expect(buffer.read()).toBe('10');
    expect(items).toEqual([null, null, null]);
  });

  test('should write to buffer multiple times and read from oldest item', () => {
    const buffer = new CircularBuffer(5);
    const items = buffer.print();
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(items).toEqual(['10', '20', '30', null, null]);
    expect(buffer.read()).toBe('10');
    expect(buffer.read()).toBe('20');
    expect(items).toEqual([null, null, '30', null, null]);
    buffer.write('40');
    buffer.write('50');
    expect(items).toEqual([null, null, '30', '40', '50']);
  });

  test('should clear a buffer and throw an error when read is called afterwards', () => {
    const buffer = new CircularBuffer(3);
    const items = buffer.print();
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(items).toEqual(['10', '20', '30']);
    buffer.clear();
    expect(items).toEqual([null, null, null]);
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('forceWrite should overwrite oldest item when buffer is full', () => {
    const buffer = new CircularBuffer(5);
    const items = buffer.print();
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    buffer.write('40');
    buffer.write('50');
    buffer.forceWrite('A');
    expect(items).toEqual(['A', '20', '30', '40', '50']);
    buffer.forceWrite('B');
    expect(items).toEqual(['A', 'B', '30', '40', '50']);
  });

  test('forcedWrite should act like write when buffer is not full', () => {
    const buffer = new CircularBuffer(5);
    const items = buffer.print();
    buffer.write('10');
    buffer.write('20');
    buffer.write('30');
    expect(items).toEqual(['10', '20', '30', null, null]);
    buffer.forceWrite('A');
    expect(items).toEqual(['10', '20', '30', 'A', null]);
    buffer.forceWrite('B');
    expect(items).toEqual(['10', '20', '30', 'A', 'B']);
  });
});
