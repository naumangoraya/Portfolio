module.exports = {
  email: 'naumanjaat@gmail.com',
  phone: '+923106623823',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/nauman-noor-goraya',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nauman_noor_',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/naumangoraya1',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/nauman-noor-goraya',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Education',
      url: '/#education',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Services',
      url: '/#services',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
