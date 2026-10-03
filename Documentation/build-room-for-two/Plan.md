# Plan - Room for Two

## Goal
Ship one free offline picnic blanket. Two people can sit. A third stays standing. The last person who sat is the one who stands.

## Approach
1. Confirm App Store Connect has no rejection waiting.
2. Build an Expo SDK 57 one-screen app. JavaScript is enough because the blanket is local state and on-device storage.
3. Run the full simulator regression on the Release binary.
4. Take three 1320×2868 screenshots after every check passes.
5. Upload that binary and submit it for review.

## Rules
- Storage key `room-for-two-v1`.
- Empty blanket has nobody seated.
- No account, ads, camera, clock, or network.
