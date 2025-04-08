import createNextPwa from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production'

const withPWA = isProd
  ? createNextPwa({
      dest: 'public',
      register: true,
      skipWaiting: true,
      // Puedes personalizar esto para limitar el scope a `/admin`
      scope: '/admin',
    })
  : (config) => config

const nextConfig = {
  output: 'standalone',
  // Obligamos a usar Webpack si estamos usando next-pwa
  ...(isProd && {
    webpack: (config) => config,
  }),
}

export default withPWA(nextConfig)
