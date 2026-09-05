
// Announcement data for the "Announcement" section
export const announcementData = {
    text: '🚀 Follow me on GitHub and Instagram!',
    badgeName: 'New!',
    };
// Header data for the "Header" section
export const headerData = {
    picture: "https://placehold.co/200x200/171515/ffffff?text=You",
    name: "Your Name",
    username: "@yourhandle",
  };

// Social media data for the "About me" section
export const socialMediaData = [
    // Each object contains the title, color, link, icon, and username
    // You can use a gradient object or a string (the color code)
    // i.e color: '#FF0000' or color: { start: '#FF0000', end: '#0000FF' }
    {
        title: 'GitHub',
        color: { start: '#171515', end: '#2b2b2b' },
        link: 'https://github.com/yourhandle',
        icon: 'FaGithub',
        username: '@yourhandle',
    },
    {
        title: 'Instagram',
        color: { start: '#F58529', end: '#DD2A7B' },
        link: 'https://www.instagram.com/yourhandle',
        icon: 'FaInstagram',
        username: '@yourhandle',
    },
    {
        title: 'Facebook',
        color: { start: '#3b5998', end: '#8b9dc3' },
        link: 'https://www.facebook.com/yourhandle',
        icon: 'FaFacebook',
        username: 'Your Name',
    },
    {
        title: 'LinkedIn',
        color: { start: '#0072b1', end: '#00a0dc' },
        link: 'https://www.linkedin.com/in/yourhandle',
        icon: 'FaLinkedin',
        username: 'Your Name',
    },
    {
        title: 'X',
        color: { start: '#1DA1F2', end: '#AAB8C2' },
        link: 'https://x.com/yourhandle',
        icon: 'FaTwitter',
        username: '@yourhandle',
    },
    {
        title: 'TikTok',
        color: { start: '#69C9D0', end: '#AA0A3A' },
        link: 'https://www.tiktok.com/@yourhandle',
        icon: 'FaTiktok',
        username: '@yourhandle',
    },
];

// Useful links data for the "Useful Links" section
export const usefulLinksData = [
    // Each object contains the title, gradient color, link, and optional isNew property
    // You can use a gradient object or a string (the color code)
    // i.e color: '#FF0000' or color: { start: '#FF0000', end: '#0000FF' }
    // You can also add a isNew property to display a "New!" badge
    // i.e isNew: true
    {
        title: 'Understanding React Hooks',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://react.dev/reference/rules/rules-of-hooks',
        isNew: true, // Indicates if the link is new
    },
    {
        title: 'CSS Grid Guide',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        isNew: false,
    },
    {
        title: 'JavaScript: The Definitive Guide',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/',
        isNew: true,
    },
    {
        title: 'The Road to React',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://react.dev/learn',
        isNew: true,
    },
    {
        title: 'Learn CSS Layout',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://learnlayout.com/',
        isNew: false,
    },
    {
        title: 'Web Development Bootcamp',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://www.udemy.com/course/the-web-developer-bootcamp/',
        isNew: true,
    },
    {
        title: 'JavaScript Info',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://javascript.info/',
        isNew: false,
    },
    {
        title: 'Modern JavaScript Tutorial',
        color: { start: '#696F6F', end: '#5F8C90' },
        link: 'https://javascript.info/first-steps',
        isNew: false,
    },
];
