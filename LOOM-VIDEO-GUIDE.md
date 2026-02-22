# Loom Video Script for Pingora

## [0:00-0:30] Introduction (Camera on, smile!)
"Hi, I'm Niharika. I'm a developer passionate about building real-time applications. Today I'll walk you through Pingora — a real-time chat application I built with Next.js, Clerk for authentication, and Convex for the backend."

## [0:30-1:30] Demo the app
*(Open your browser to https://pingora-zeta.vercel.app/)*
"Let me show you Pingora in action. I'll sign in with my account... and here's the dashboard. You can see all your conversations on the left, and the active chat on the right. Notice how messages appear instantly — that's the real-time magic."

## [1:30-2:30] Code walkthrough - Feature you're proud of
*(Open your editor, show `convex/messages.ts`)*
"This is my favorite part — the message sending logic. It uses Convex's `mutation` function to add messages to the database. The cool thing is Convex automatically handles the real-time sync — when I add a message here, it instantly appears for all connected clients."

## [2:30-3:30] Live code change demo
*(Open `components/navbar.tsx` or `tailwind.config.ts`)*
"Let me make a quick change — I'll update the gradient color from blue-purple to green-teal. *(make the change)* Now let me save and refresh the browser... see how the logo instantly updates? That's the power of hot reloading in Next.js."

## [3:30-4:30] Tech stack summary
*(Show your `package.json` or `convex/schema.ts`)*
"Under the hood, I'm using Next.js 14 for the framework, Clerk for secure authentication with 2FA, and Convex as the serverless backend. The schema is defined in TypeScript, which gives me type safety across the entire app."

## [4:30-5:00] Closing
"Thanks for watching! Pingora is live at pingora-zeta.vercel.app. Check out the code on GitHub at github.com/Niharika011205/Pingora. Let me know what you think!"

---

## Tips for recording:
- Test your screen sharing beforehand
- Have your code editor ready with the files you'll show
- Keep your browser open to the deployed app
- Practice the script 2-3 times before recording
- Speak naturally — it's okay to pause and think

Good luck! 🚀
