const responseHeaders = {
  'Keep-Alive': 'timeout=60',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  Vary: ['Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
  Expires: '0',
  Pragma: 'no-cache',
  'X-XSS-Protection': '0',
  Date: '{{now}}',
  'Content-Type': 'application/json',
}

export default responseHeaders
