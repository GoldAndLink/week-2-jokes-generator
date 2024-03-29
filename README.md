# Weekend Project

## To consolidate the knowledge acquired in this week, the students should complete the following project:

1. Create a github repository for your project
2. Add all members of your group
3. Create a README.md file with the description of your project
4. Create a new application from scratch using NextJS
5. Create a page for generating jokes using AI
6. Add a feature for users to customize the Joke Parameters

   * You can pick what kind of parameters you would like to offer for your users
   * For example, you could allow users to pick a topic from a list of options (work, people, animals, food, television, etc), a tone for the joke (witty, sarcastic, silly, dark, goofy, etc), the kind of joke (pun, knock-knock, story, etc), and the "temperature" of it (how much randomness/fun you want to add to the joke)
   * Consider how you're going to assemble the prompt for the AI model to abide to these parameters

7. After configuring the parameters, users should click a button to generate the joke, and the generated response must be returned to the user's screen inside the same page
8. Add a feature for the AI to evaluate if the generated jokes are funny or not, appropriated or not, offensive or not, and other criteria you might judge important
9. Run the Text Generation WebUI application on your local environment and use it to serve the text generation tasks for your application
10. Submit your project in the submission form

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies:
```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
