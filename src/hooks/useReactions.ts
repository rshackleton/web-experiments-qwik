import type { QRL, Signal } from '@builder.io/qwik';
import {
  $,
  noSerialize,
  useStore,
  useVisibleTask$,
  type NoSerialize,
} from '@builder.io/qwik';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { client } from '~/db/supabase';

type Reaction = {
  name: 'heart' | '+1' | '-1' | 'wow';
};

type ReactionsStore = {
  count: number;
  reactions: Reaction[];
  channel: NoSerialize<RealtimeChannel>;

  /** Create new realtime channel. */
  createChannel: QRL<() => void>;

  /** Send message to all clients in channel. */
  sendReaction: QRL<(value: Reaction) => void>;
};

export function useReactions(consent: Signal<boolean>) {
  const store = useStore<ReactionsStore>({
    channel: undefined,
    count: 0,
    reactions: [],

    createChannel: $(function (this: ReactionsStore) {
      this.channel = noSerialize(client.channel('room-1'));
    }),

    sendReaction: $(function (this: ReactionsStore, value: Reaction) {
      console.log(`Reaction`, `Sent`, value);

      this.reactions.push(value);

      this.channel?.send({
        type: 'broadcast',
        event: 'reaction',
        payload: {
          message: value,
        },
      });
    }),
  });

  useVisibleTask$(
    async ({ cleanup, track }) => {
      track(consent);

      cleanup(() => {
        store.channel?.unsubscribe();
        store.channel = undefined;
      });

      // Ensure user has given consent.
      if (!consent.value) {
        return;
      }

      // Ensure a channel exists.
      if (store.channel === undefined) {
        await store.createChannel();
      }

      // Check again to satisfy typescript.
      if (!store.channel) {
        return;
      }

      // Subscribe to channel events and track presence.
      store.channel
        // Sync remote presence state with local signals.
        .on('presence', { event: 'sync' }, () => {
          const newState = store.channel?.presenceState() ?? {};
          console.log(`Presence`, `Sync`, newState);
          store.count = Object.keys(newState).length;
        })
        // Watch for reactions, push to signal array.
        .on('broadcast', { event: 'reaction' }, ({ payload }) => {
          console.log(`Reaction`, `Received`, payload.message);
          store.reactions.push(payload.message);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const presenceTrackStatus = await store.channel?.track({
              online_at: new Date().toISOString(),
            });

            console.log(`Presence`, `Track`, presenceTrackStatus);
          }
        });
    },
    { strategy: 'document-idle' },
  );

  return store;
}
