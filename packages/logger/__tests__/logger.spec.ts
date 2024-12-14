import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createLogger } from '../src/index';

describe('creator', () => {
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log');
    consoleDebugSpy = vi.spyOn(console, 'debug');
    consoleWarnSpy = vi.spyOn(console, 'warn');
    consoleErrorSpy = vi.spyOn(console, 'error');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test('should create a logger with default log level set to "info"', () => {
    const logger = createLogger();

    expect(logger.getLevel()).toBe('info');
  });

  test('should create a logger with custom log level set', () => {
    const logger = createLogger();

    logger.setLevel('debug');
    expect(logger.getLevel()).toBe('debug');
  });

  test('should log messages with level "log" when log level is "log"', () => {
    const logger = createLogger();

    logger.log('Test log message');
    expect(consoleLogSpy).toHaveBeenCalledWith('Test log message');
  });

  test('should log messages with level "debug" when log level is "debug"', () => {
    const logger = createLogger();

    logger.setLevel('debug');
    logger.debug('Test debug message');
    expect(consoleDebugSpy).toHaveBeenCalledWith('Test debug message');
  });

  test('should log messages with level "warn" when log level is "warn"', () => {
    const logger = createLogger();

    logger.setLevel('warn');
    logger.warn('Test warn message');
    expect(consoleWarnSpy).toHaveBeenCalledWith('Test warn message');
  });

  test('should log messages with level "error" when log level is "error"', () => {
    const logger = createLogger();

    logger.setLevel('error');
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message');
  });

  test('should log messages with prefix when provided', () => {
    const logger = createLogger({ prefix: '[TEST]' });

    logger.log('Test log message');
    expect(consoleLogSpy).toHaveBeenCalledWith('[TEST]', 'Test log message');
  });

  test('should log time when logTime option is true', () => {
    const logger = createLogger({ logTime: true });

    logger.log('Test log message');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.anything(),
      'Test log message',
    );
  });
});
