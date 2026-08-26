# Founder visual QA

## Desktop pass 1

The exposed sandbox preview loaded the updated landing page and confirmed the founder copy is present in the page flow after FAQ and before the existing mission band. The global navigation, Applytics logo, page background, black mission band, CTA, and footer remain visually consistent with the existing landing system.

The founder content is present in the extracted page structure with the expected heading, three approved paragraphs, attribution, LinkedIn link, and About link. The first viewport and footer viewport did not show layout overflow or new navigation clutter. A second pass is needed at the founder section itself and at a narrow viewport before final deployment.

## Desktop pass 2

At the lower-page transition, the existing black mission band remains visually strong and the red accent is consistent. The founder block is above this band, so anchor navigation is preferable to repeated long scrolls for a direct section-level check. No visible overflow or broken footer navigation appeared in the lower-page pass.

## Mobile pass

A dedicated browser session was resized to 390 × 844. The founder section remained within the viewport: document `scrollWidth` was 390, the section width was 390, and the portrait rendered at x=24 with width 342, matching the mobile content gutter. This confirms the text and portrait stack without horizontal overflow.

The browser reported only development-session HMR connection errors and resource preload warnings. There were no founder component or image-loading errors. The production build had already compiled successfully.
