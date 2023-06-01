// @ts-ignore
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],
    // @ts-ignore
    app: {
        head: {
            bodyAttrs: {
              class: 'bg-secondary'
            },
            title: "TT",
            script: [
            ],
            link: [
                {
                    rel:'stylesheet',
                    href:'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
                }
            ]
        }
    },
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css'
    ]
})