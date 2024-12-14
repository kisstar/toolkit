export type LogType = 'debug' | 'log' | 'warn' | 'error';

export type LogLevel = 'warn' | 'error' | 'debug' | 'info' | 'off';

export type LevelMap = {
  [key in LogLevel]: LogType[];
};

export type LogByType = (
  type: LogType,
  level: LogLevel,
  ...args: unknown[]
) => void;

export interface Logger {
  log: Console['log'];
  debug: Console['debug'];
  warn: Console['warn'];
  error: Console['error'];
  setLevel: (level: LogLevel) => void;
  getLevel: () => LogLevel;
}

export type LoggerCreator = (options?: {
  prefix?: string;
  logTime?: boolean;
}) => Logger;

const levelMap: LevelMap = {
  info: ['log', 'warn', 'error'],
  debug: ['debug', 'log', 'warn', 'error'],
  warn: ['warn', 'error'],
  error: ['error'],
  off: [],
};

/**
 * 创建一个根据日志类型和级别输出日志的函数。
 *
 * @param options 配置对象
 * @param options.prefix 日志前缀，可选
 * @param options.logTime 是否在日志中显示时间戳，可选
 * @returns 返回一个函数，该函数根据日志类型和级别输出日志
 */
function factory(
  options: { prefix?: string; logTime?: boolean } = {},
): LogByType {
  return function logger(type, level, ...args) {
    const { prefix = '', logTime } = options;
    const fn = console[type];
    const levelList = levelMap[level];

    // 指定的方法不存在或当期日志级别不允许则退出
    if (!fn || !levelList.includes(type)) {
      return;
    }

    if (logTime) {
      args.unshift(`[${new Date().toLocaleString().replace(/\//g, '-')}]`);
    }
    if (prefix) {
      args.unshift(prefix);
    }

    fn.call(console, ...args);
  };
}

/**
 * 创建一个 Logger 实例
 *
 * @param options 配置选项
 * @param options.prefix 日志前缀，可选
 * @param options.logTime 是否记录日志时间，可选
 * @returns 返回 Logger 实例
 */
const createLogger: LoggerCreator = function creator(options?: {
  prefix?: string;
  logTime?: boolean;
}): Logger {
  const logByType = factory(options);
  let localLevel: LogLevel = 'info';

  function setLevel(level: LogLevel) {
    localLevel = level;
  }

  function getLevel(): LogLevel {
    return localLevel;
  }

  return {
    log: (...args) => logByType('log', localLevel, ...args),
    debug: (...args) => logByType('debug', localLevel, ...args),
    warn: (...args) => logByType('warn', localLevel, ...args),
    error: (...args) => logByType('error', localLevel, ...args),
    setLevel,
    getLevel,
  };
};

export default createLogger;
