# Easy peasy logging
module.exports = class Log
  clog = (k, m) -> console?[k]?(m)

  @d: (m) -> clog 'debug', m

  @w: (m) -> clog 'warn', m

  @i: (m) -> clog 'info', m

  @e: (m) -> clog 'error', m
