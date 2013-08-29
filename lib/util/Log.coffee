# Easy peasy logging
module.exports = class Log
  clog = (k, m) -> console?[k]?(m)

  # Debug log message
  @d: (m) -> clog 'debug', m

  # Warning log message
  @w: (m) -> clog 'warn', m

  # Info log message
  @i: (m) -> clog 'info', m

  # Error log message
  @e: (m) -> clog 'error', m

  # WTF log message
  @wtf: (m) -> clog 'error', "WTF! #{m}"
