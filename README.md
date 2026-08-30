# Introducing Drawy-party (partykit + postgres version of the drawy app)

A real time collaboration capable drawing app(powered by Excalidraw) which is easy to deploy and host
built with the tech stack you already know.

[![Netlify Status](https://api.netlify.com/api/v1/badges/87baadb1-b688-415f-8faf-ee6084958e37/deploy-status)](https://app.netlify.com/projects/drawy-draw/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/pratyay360/drawy-party)

[use now](https://drawy-party.pratyay.qzz.io)

## if you want to run it host on your own partykit account and bring your own PostgreSQL db with pg pool support preferably and running on Netlify is purely optional, this app is built with [nitro](https://nitro.build/)

## nitro is easy to deploy so no issues [deploy adapter](https://nitro.build/deploy)

## partykit for real time collab because it's free + nice .

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
2. POSTGREs ([postgresql](https://www.postgresql.org/))    [for free db connection refer to this article](https://github.com/alexeyfv/awesome-free-postgres)
4. Tanstack start(frontend)
5. vite-plus + nub (for dependency management)
   (nub cz it's something new )
