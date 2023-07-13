import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { channel } from '~/db/supabase';

export default component$(() => {
  const consentSignal = useSignal(false);
  const countSignal = useSignal(0);
  const reactionSignal = useSignal<string[]>([]);

  useVisibleTask$(
    async ({ track }) => {
      track(consentSignal);

      if (!consentSignal.value) {
        return;
      }

      channel
        // Sync remote presence state with local signals.
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          console.log(`Presence`, `Sync`, newState);
          countSignal.value = Object.keys(newState).length;
        })
        // Watch for reactions, push to signal array.
        .on('broadcast', { event: 'reaction' }, ({ payload }) => {
          console.log(`Reaction`, `Received`, payload.message);
          reactionSignal.value = [...reactionSignal.value, payload.message];
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            const presenceTrackStatus = await channel.track({
              online_at: new Date().toISOString(),
            });

            console.log(`Presence`, `Track`, presenceTrackStatus);
          }
        });
    },
    { strategy: 'document-idle' },
  );

  const sendReaction = $((value: string) => {
    console.log(`Reaction`, `Sent`, value);

    reactionSignal.value = [...reactionSignal.value, value];

    channel.send({
      type: 'broadcast',
      event: 'reaction',
      payload: {
        message: value,
      },
    });
  });

  return (
    <>
      {consentSignal.value ? (
        <div class="flex flex-col gap-4">
          <p class="text-xl" aria-live="polite">
            Number of active users:{' '}
            <span class="text-purple-700 font-medium tabular-nums">
              {countSignal}
            </span>
          </p>

          <div class="flex gap-4">
            <p class="font-medium">Click to react:</p>
            <ul class="flex gap-4">
              <li>
                <button
                  type="button"
                  onClick$={() => {
                    sendReaction('❤️');
                  }}
                  preventdefault:click
                >
                  ❤️
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick$={() => {
                    sendReaction('👍');
                  }}
                  preventdefault:click
                >
                  👍
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick$={() => {
                    sendReaction('👎');
                  }}
                  preventdefault:click
                >
                  👎
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick$={() => {
                    sendReaction('😮');
                  }}
                  preventdefault:click
                >
                  😮
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p class="font-medium">Reactions:</p>
            <ul aria-atomic="true" aria-live="polite">
              {reactionSignal.value.map((message, index) => (
                <li
                  key={`${message}-${index}`}
                  aria-label={`Someone reacted with ${message}`}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <label class="text-lg font-medium flex gap-2 mb-12">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            bind:checked={consentSignal}
          />
          I consent to the real-time social functionality.
        </label>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
