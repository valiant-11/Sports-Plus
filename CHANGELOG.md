# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Monetization UI: Freemium Foundation & Onboarding Paywall.
- `ProBadge` component for adaptive, premium user identification across feeds and profiles.
- `SubscriptionScreen` module for the premium paywall intercept.
- `mockData.ts` updated with `subscriptionTier` field to mock freemium state logic.

### Changed
- Refined `ProBadge` styling: sizing now adapts to `sm` (for feeds, matching 22px height of standard tags) and `md` (pill-shaped for profiles).
- Streamlined `SubscriptionScreen` with polished geometric layouts (`rounded-[2rem]`), hidden overflows, and optimized feature list spacing.
- Fixed UI bugs: forced `bg-[#10b981]` emerald overrides to bypass Tailwind caching/class conflict issues rendering buttons invisible.
- Synced `HomeScreen` and `ProfileScreen` feeds with the new `ProBadge`.
