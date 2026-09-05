# Introducing Drawy-party (partykit + postgres version of the drawy app)

A real time collaboration capable drawing app(powered by Excalidraw) which is easy to deploy and self host built with the tech stack you already know.
A easily selfhostable collaborative whiteboard powered by Excalidraw, PartyKit, and Postgres.
Got tired of the single board limitation in excalidraw and wanted something I could actually deploy myself. Though the official Excalidraw Docker image is easy to run,
but it doesn't provide a collaboration without a paid membership Drawy-Party adds a persistent, collaborative backend using PartyKit and postgres while
keeping Excalidraw as the whiteboard experience. Also, there are several similar alternatives like this, but tbh who wants to spin 2 3
containers when everything can be compressed into one. Any one can deploy it on Vercel / Netlify like serverless platform..
The goal is simple: deploy it anywhere, create virtually unlimited boards, and collaborate in real time.

A real time collaboration capable drawing app(powered by Excalidraw) which is easy to deploy and host +
built with the tech stack you already know.

[![drawy party demo](https://img.youtube.com/vi/CLnAY4AO0yY/hqdefault.jpg)](http://www.youtube.com/watch?v=CLnAY4AO0yY "drawy + partykit")

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPratyay360%2Fdrawy-party&env=VITE_PARTYKIT_URL,PARTYKIT_SECRET,DATABASE_URL,SESSION_SECRET&project-name=drawy-party&repository-name=drawy-party)

[use now](https://drawyparty.pratyay.qzz.io)

## if you want to run it host on your own partykit account and bring your own PostgreSQL db with pg pool support preferably and running on Netlify is purely optional, this app is built with [nitro](https://nitro.build/)

## nitro is easy to deploy so no issues [deploy adapter](https://nitro.build/deploy)

## partykit for real time collab because it's free + nice

With [Excalidraw canvas](https://npmx.dev/package/@excalidraw/excalidraw) with
[library Suppport](https://libraries.excalidraw.com/?theme=light&sort=default)

Using partykit and [sync](https://docs.partykit.io/)
and Netlify for hosting ... you can use any hosting provider if you want to ...
if facing issues while hosting partykit, you can run it in your own cloudflare account.

Host your own version, for privacy and owning your own data also relying on the
hosted instance is not recommended cz (I am also on the free tier and can go off anytime on
exhausting the limits).

Refer to `.env.example` for the naming conventions of .env also you can use
[mise](https://mise.jdx.dev/) for managing dev enviournment variables ..

tech stack

1. PARTYKIT ([partykit](https://github.com/partykit/partykit))
2. POSTGREs ([postgresql](https://www.postgresql.org/)) [for free db connection refer to this article](https://github.com/alexeyfv/awesome-free-postgres)
3. Tanstack start(frontend)
4. vite-plus + nub (for dependency management)

If this has helped you, consider [supporting me](https://pratyayupi.surge.sh/).