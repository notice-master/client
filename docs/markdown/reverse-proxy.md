# 添加反向代理

利用反向代理解决浏览器前端跨域问题

```nginx
#PROXY-START/

location ^~ /wx/
{
    proxy_pass https://api.weixin.qq.com/;
    proxy_set_header Host api.weixin.qq.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;
    # proxy_hide_header Upgrade;

    add_header X-Cache $upstream_cache_status;
    #Set Nginx Cache

    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods *;
    #set CORS
}
#PROXY-END/
```

> 在 nginx 配置文件中引用反向代理配置

```nginx
include /www/server/panel/vhost/nginx/proxy/api.example.cn/wechat_api.conf;
```
