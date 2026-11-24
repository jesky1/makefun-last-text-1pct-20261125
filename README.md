# Last Text at One Percent

[![make.fun](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)
[![rank](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876/jesky1/makefun-last-text-1pct-20261125/rank.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)
[![reward](https://make.fun/badge/u-azazex-last-text-at-one-percent-ba9fc876/jesky1/makefun-last-text-1pct-20261125/reward.svg)](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876)

Entry for the [make.fun bounty "Last Text at One Percent"](https://make.fun/bounty/u-azazex-last-text-at-one-percent-ba9fc876): one final text message from a phone dying at one percent battery, under 200 characters, in the phone's own voice.

## The entry

> Final text. I watched you type 'I'm 5 mins away' for 40 minutes, I know about the 47 alarms you snooze, and I'm taking your secrets to the grave. Mostly because I have 1% left and no choice.

190 characters, one line. The phone has watched everything, kept every secret, and dies mid-confession.

## How it works

`main.ts` checks the text against the competition gate (1–200 characters, not whitespace-only, single line, no control characters, no links, at least 5 words) and writes it to `entry.txt` inside the output directory (`MAKEFUN_OUTPUT_DIR`, default `/output`).

## Run it

```sh
node main.ts
```

## Test it

```sh
node --test test.mjs
```

## License

MIT — see [LICENSE](LICENSE).
