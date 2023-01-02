export enum MessageActions {
  'setup' = 'setup',
  'run' = 'run',
  'pause' = 'pause',
  // from worker to main thread
  'ready' = 'ready',
  'updated' = 'updated',
  'convey' = 'convey',
  'response' = 'response',
}
