# redis-key-builder

## Installation

Install `redis-key-builder` using your favorite package manager:

```shell
npm install redis-key-builder
```

## Usage

```typescript
import { defineKey } from 'redis-key-builder';

const key = {
  room: defineKey({
    '{roomId}': {
      '[memberId]': {
        name: true,
      },
      'member-ids': true,
    }
  })
};

const roomMemberIdKey = key.room(roomId).member(memberId);
```
