export default{
    singular: true,
    "theme": {
      "@primary-color": "#EB2F96"
    },
    plugins: [
        ['umi-plugin-react', {
          antd: true,
          dva: true,
        }],
      ],
      routes: [{
        path: '/login',
        component: 'login',
      },
        {
        path: '/',
        component: '../layout',
        routes: [
          {
            path:'/',
            component:'search'
          },
         
          {
            path:'/search',
            component:'search'
          },
          {
            path:'/find',
            component:'find'
          },
          {
            path: '/my',
            component: 'my'
          },
        ]
      }],

      proxy: {
            '/fcg_v8_toplist_cp.fcg': {
              target: 'https://c.y.qq.com/v8/fcg-bin',
              changeOrigin: true,
            },
          },
};
