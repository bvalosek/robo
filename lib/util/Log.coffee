# Easy peasy logging
module.exports = class Log
  log = (k, m) -> console?[k]?(m)

  # Debug log message
  @d: (m) -> log 'debug', m

  # Warning log message
  @w: (m) -> log 'warn', m

  # Info log message
  @i: (m) -> log 'info', m

  # Error log message
  @e: (m) -> log 'error', m

  # WTF log message
  @wtf: (m) -> log 'error', "WTF! #{m}"
