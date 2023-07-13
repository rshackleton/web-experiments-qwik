import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { useReactions } from '~/hooks/useReactions';

export default component$(() => {
  const store = useReactions();

  return (
    <>
      {store.consent ? (
        <div class="flex flex-col gap-4">
          <p class="text-xl" aria-live="polite">
            Number of active users:{' '}
            <span class="text-purple-700 font-medium tabular-nums">
              {store.count}
            </span>
          </p>

          <div class="flex gap-4">
            <p class="font-medium">Click to react:</p>
            <ul class="flex gap-4">
              <li>
                <button
                  type="button"
                  onClick$={() => {
                    store.sendReaction({ name: 'heart' });
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
                    store.sendReaction({ name: '+1' });
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
                    store.sendReaction({ name: '-1' });
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
                    store.sendReaction({ name: 'wow' });
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
              {store.reactions.map((reaction, index) => (
                <li
                  key={`${reaction}-${index}`}
                  aria-label={`Someone reacted with ${reaction}`}
                >
                  {reaction.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <button
              onClick$={() => {
                store.consent = false;
              }}
            >
              Revoke Consent
            </button>
          </div>
        </div>
      ) : (
        <label class="text-lg font-medium flex gap-2 mb-12">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            checked={store.consent}
            onChange$={(_, el) => (store.consent = el.checked)}
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
